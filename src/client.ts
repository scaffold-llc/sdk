import { COMMANDS, type ErrorCode, type Methods } from "./generated/methods.js";

/** The API version this SDK was built for. */
export const API_VERSION = "2026-10-01";

export interface ScaffoldOptions {
  /** A token from Settings, then Apps and tokens. Defaults to `SCAFFOLD_TOKEN`. It acts as you in its workspace, so never send it to a browser. */
  token?: string;
  /** Defaults to `https://scaffold.llc`. Must be `https`, or `http` on `localhost`. */
  baseUrl?: string;
  /** Milliseconds per request. Defaults to `30000`. */
  timeout?: number;
  /** Retries for 429 and 5xx answers, with backoff. Defaults to `2`. */
  maxRetries?: number;
  /** The API version every request sends as `Scaffold-Version`. Defaults to the SDK's own, `2026-10-01`. */
  version?: string;
  /** Your app's secret, for the `app_auth` methods its server calls for its users. Defaults to `SCAFFOLD_AUTH_SECRET`, which every server app gets. Never send it to a browser. */
  appSecret?: string;
}

export interface WriteOptions {
  /** A retried write with the same key returns the first result instead of running twice. Defaults to a new key per call, which the SDK's own retries reuse. */
  idempotencyKey?: string;
}

export interface AppServerOptions {
  /** The address of the user your server calls for, like its request's client IP, so each user spends their own rate limits rather than all of them your server's. Needs `appSecret`. */
  clientIp?: string;
}

export interface Route {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  /** A read that answers a page of `data`, paged by `starting_after`. */
  list?: boolean;
  /** The input field sent as the raw body, a zip, instead of the JSON body. */
  zip?: string;
  /** A write that takes `Idempotency-Key`, so sending it again never runs it twice. */
  idempotent?: boolean;
  /** An app user route the app's own server calls with its secret instead of a token. */
  appServer?: boolean;
}

/** A failed call, with the same `type` as the HTTP error body. */
export class ScaffoldError extends Error {
  override name = "ScaffoldError";

  constructor(
    readonly status: number,
    /** `unexpected_response` when something other than Scaffold answered, like a proxy. */
    readonly type: ErrorCode | "unexpected_response",
    message: string,
    /** The input field at fault, like `title`. */
    readonly param: string | undefined,
    /** What support finds the failure by. */
    readonly requestId: string | undefined,
    readonly details: unknown,
    /** Seconds the answer asked to wait before trying again. */
    readonly retryAfter: number | undefined,
  ) {
    super(message);
  }
}

/** One page when awaited; with `for await`, every item, fetching each next page as you reach it. */
export class List<Page, Item> implements PromiseLike<Page>, AsyncIterable<Item> {
  #first: Promise<Page> | undefined;

  constructor(private readonly fetchPage: (startingAfter?: string) => Promise<Page>) {}

  then<A = Page, B = never>(onFulfilled?: ((page: Page) => A | PromiseLike<A>) | null, onRejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<A | B> {
    this.#first ??= this.fetchPage();
    return this.#first.then(onFulfilled, onRejected);
  }

  async *[Symbol.asyncIterator](): AsyncIterator<Item> {
    let page: unknown = await this;
    for (;;) {
      const { data, has_more, next_cursor } = page as { data: Item[]; has_more: boolean; next_cursor?: string | null };
      yield* data;
      if (!has_more || typeof next_cursor !== "string") return;
      page = await this.fetchPage(next_cursor);
    }
  }
}

type Input = Record<string, unknown>;
type CallOptions = WriteOptions & AppServerOptions;

export interface Scaffold extends Methods {}

/** The Scaffold API client: `scaffold.<resource>.<action>(input)` for every public command. */
export class Scaffold {
  readonly #token: string | undefined;
  readonly #baseUrl: string;
  readonly #timeout: number;
  readonly #maxRetries: number;
  readonly #version: string;
  readonly #appSecret: string | undefined;

  constructor(options: ScaffoldOptions = {}) {
    const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
    this.#token = options.token ?? env?.SCAFFOLD_TOKEN;
    this.#baseUrl = (options.baseUrl ?? "https://scaffold.llc").replace(/\/+$/, "");
    const { protocol, hostname } = new URL(this.#baseUrl);
    if (protocol !== "https:" && !(protocol === "http:" && LOOPBACK.has(hostname))) throw new TypeError(`baseUrl must be https, or http on localhost, not ${protocol}`);
    this.#timeout = options.timeout ?? 30_000;
    this.#maxRetries = options.maxRetries ?? 2;
    this.#version = options.version ?? API_VERSION;
    this.#appSecret = options.appSecret ?? env?.SCAFFOLD_AUTH_SECRET;
    for (const [resource, actions] of Object.entries(COMMANDS)) {
      const methods = Object.entries(actions as Record<string, Route>).map(([action, route]) => {
        const call = (input: Input = {}, options: CallOptions = {}) => (route.list ? new List((startingAfter) => this.#call(route, startingAfter === undefined ? input : { ...input, starting_after: startingAfter }, options)) : this.#call(route, input, options));
        return [action, call];
      });
      Object.assign(this, { [resource]: Object.fromEntries(methods) });
    }
  }

  async #call(route: Route, input: Input, options: CallOptions): Promise<unknown> {
    const rest = { ...input };
    const path = route.path.replace(/\{(\w+)\}/g, (_, name: string) => {
      const value = rest[name];
      if (value === undefined) throw new TypeError(`${route.method} ${route.path} needs ${name}`);
      delete rest[name];
      // The URL parser would read these as the current or parent folder and change the route.
      if (value === "." || value === "..") throw new TypeError(`${route.method} ${route.path} cannot take ${value} as ${name}`);
      return encodeURIComponent(String(value));
    });
    const url = new URL(this.#baseUrl + path);
    const headers: Record<string, string> = { Accept: "application/json", "Scaffold-Version": this.#version };
    if (route.appServer) {
      if (options.clientIp !== undefined && this.#appSecret === undefined) throw new TypeError(`clientIp needs appSecret or SCAFFOLD_AUTH_SECRET, so only your server can pass it`);
      if (this.#appSecret !== undefined) headers["Scaffold-App-Secret"] = this.#appSecret;
      if (options.clientIp !== undefined) headers["Scaffold-Client-Ip"] = options.clientIp;
    } else if (this.#token) headers.Authorization = `Bearer ${this.#token}`;
    if (route.idempotent) headers["Idempotency-Key"] = options.idempotencyKey ?? crypto.randomUUID();
    let body: BodyInit | undefined;
    if (route.method === "GET" || route.method === "DELETE") {
      // A query string has no null, so a null field is left out like an undefined one.
      for (const [key, value] of Object.entries(rest)) if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    } else if (route.zip !== undefined) {
      headers["Content-Type"] = "application/zip";
      body = rest[route.zip] as BodyInit;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(rest);
    }

    for (let attempt = 0; ; attempt++) {
      // A redirect would carry the app secret to wherever it points, so it fails as unexpected_response.
      const response = await fetch(url, { method: route.method, headers, body, redirect: "manual", signal: AbortSignal.timeout(this.#timeout) });
      if (response.ok) return response.headers.get("Content-Type")?.includes("json") ? response.json() : response.blob();
      const error = await failure(response);
      // A 429 or 503 never ran. A 501 answers the same until the platform changes. Any other 5xx
      // is sent again only when that cannot run it twice.
      const retryable = response.status === 429 || response.status === 503 || (response.status >= 500 && response.status !== 501 && (route.method === "GET" || route.idempotent));
      if (!retryable || attempt >= this.#maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, (error.retryAfter ?? backoff(attempt)) * 1000));
    }
  }
}

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** Seconds before retry `attempt + 1` when the answer named no wait: about 0.5, 1, 2 and on, with jitter. */
const backoff = (attempt: number) => 0.5 * 2 ** attempt * (0.5 + Math.random() / 2);

async function failure(response: Response): Promise<ScaffoldError> {
  const text = await response.text();
  const header = response.headers.get("Retry-After");
  const retryAfter = header === null || Number.isNaN(Number(header)) ? undefined : Number(header);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }
  const error = (parsed as { error?: { type?: unknown; message?: unknown; param?: unknown; request_id?: unknown; details?: unknown } } | undefined)?.error;
  if (typeof error?.type === "string" && typeof error.message === "string") {
    const text = (value: unknown) => (typeof value === "string" ? value : undefined);
    return new ScaffoldError(response.status, error.type as ErrorCode, error.message, text(error.param), text(error.request_id), error.details, retryAfter);
  }
  return new ScaffoldError(response.status, "unexpected_response", `HTTP ${response.status}: ${text.slice(0, 200)}`, undefined, undefined, undefined, retryAfter);
}
