// Generated from crates/server/openapi.json and web/src/site/docs/catalog.json by npm run generate. Do not edit.
import type { AppServerOptions, List, Route, WriteOptions } from "../client.js";
import type { operations } from "./openapi.js";

/** Every `code` a failed call can answer with. */
export type ErrorCode = "invalid_request" | "unauthorized" | "credits_exhausted" | "cap_reached" | "forbidden" | "plan_required" | "locked" | "challenge_ended" | "project_suspended" | "wrong_password" | "sign_in_again" | "terms_not_accepted" | "provider_unfinished" | "not_found" | "conflict" | "stale_version" | "restorable_project" | "terms_changed" | "secret_shown" | "storage_full" | "validation_failed" | "idempotency_key_reused" | "rate_limited" | "too_many_streams" | "internal" | "not_implemented" | "not_configured" | "upstream" | "unavailable";

/** Each public command's route, by resource and action. */
export const COMMANDS = {
  account: {
    get: { method: "GET", path: "/v1/account" },
  },
  image: {
    get: { method: "GET", path: "/v1/images/{image_id}" },
  },
  workspace: {
    create: { method: "POST", path: "/v1/workspaces", idempotent: true },
    rename: { method: "POST", path: "/v1/workspaces/{workspace_id}/rename", idempotent: true },
    logo_set: { method: "POST", path: "/v1/workspaces/{workspace_id}/logo", idempotent: true },
    delete: { method: "DELETE", path: "/v1/workspaces/{workspace_id}", idempotent: true },
    restore: { method: "POST", path: "/v1/workspaces/{workspace_id}/restore", idempotent: true },
    export_start: { method: "POST", path: "/v1/workspaces/{workspace_id}/exports", idempotent: true },
    export_get: { method: "GET", path: "/v1/workspaces/{workspace_id}/export" },
    export_download: { method: "GET", path: "/v1/workspaces/{workspace_id}/exports/{export_id}/download" },
    list: { method: "GET", path: "/v1/workspaces" },
    member_invite: { method: "POST", path: "/v1/workspaces/{workspace_id}/invites", idempotent: true },
    invite_revoke: { method: "DELETE", path: "/v1/invites/{invite_id}", idempotent: true },
    invite_restore: { method: "POST", path: "/v1/invites/{invite_id}/restore", idempotent: true },
    invite_dismiss: { method: "POST", path: "/v1/invites/{invite_id}/dismiss", idempotent: true },
    invite_accept: { method: "POST", path: "/v1/invites/accept", idempotent: true },
    invite_decline: { method: "POST", path: "/v1/invites/decline", idempotent: true },
    invite_get: { method: "POST", path: "/v1/invites/preview" },
    member_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/members" },
    ownership_transfer: { method: "POST", path: "/v1/workspaces/{workspace_id}/transfer-ownership", idempotent: true },
    member_remove: { method: "DELETE", path: "/v1/workspaces/{workspace_id}/members/{person_id}", idempotent: true },
  },
  project: {
    create: { method: "POST", path: "/v1/projects", idempotent: true },
    list: { method: "GET", path: "/v1/projects", list: true },
    get: { method: "GET", path: "/v1/projects/{project_id}" },
    metrics_get: { method: "GET", path: "/v1/projects/{project_id}/metrics" },
    address_check: { method: "GET", path: "/v1/projects/address-check" },
    delete: { method: "DELETE", path: "/v1/projects/{project_id}", idempotent: true },
    restore: { method: "POST", path: "/v1/projects/{project_id}/restore", idempotent: true },
    erase: { method: "POST", path: "/v1/projects/{project_id}/erase", idempotent: true },
    rename: { method: "POST", path: "/v1/projects/{project_id}/rename", idempotent: true },
    description_set: { method: "PUT", path: "/v1/projects/{project_id}/description", idempotent: true },
    health_get: { method: "GET", path: "/v1/projects/{project_id}/health" },
    status_get: { method: "GET", path: "/v1/projects/{project_id}/status" },
    limits_get: { method: "GET", path: "/v1/projects/{project_id}/limits" },
    alert_get: { method: "GET", path: "/v1/projects/{project_id}/alerts" },
    alert_set: { method: "PUT", path: "/v1/projects/{project_id}/alerts", idempotent: true },
    maintenance_set: { method: "PUT", path: "/v1/projects/{project_id}/maintenance", idempotent: true },
    move: { method: "POST", path: "/v1/projects/{project_id}/move", idempotent: true },
    credentials_rotate: { method: "POST", path: "/v1/projects/{project_id}/credentials/rotate", idempotent: true },
    claim_link_create: { method: "POST", path: "/v1/projects/{project_id}/claim-link" },
    claim_link_cancel: { method: "DELETE", path: "/v1/projects/{project_id}/claim-link", idempotent: true },
  },
  env: {
    set: { method: "POST", path: "/v1/projects/{project_id}/env" },
    list: { method: "GET", path: "/v1/projects/{project_id}/env" },
    delete: { method: "DELETE", path: "/v1/projects/{project_id}/env/{name}", idempotent: true },
    restore: { method: "POST", path: "/v1/projects/{project_id}/env/{name}/restore", idempotent: true },
  },
  source: {
    upload: { method: "PUT", path: "/v1/projects/{project_id}/sources", zip: "archive", idempotent: true },
    upload_files: { method: "POST", path: "/v1/projects/{project_id}/sources/files", idempotent: true },
    delete: { method: "DELETE", path: "/v1/projects/{project_id}/sources/{sha256}", idempotent: true },
    list: { method: "GET", path: "/v1/projects/{project_id}/sources" },
    file_list: { method: "GET", path: "/v1/projects/{project_id}/sources/{sha256}/files" },
    file_get: { method: "GET", path: "/v1/projects/{project_id}/sources/{sha256}/file" },
  },
  github: {
    repository_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/github/repositories" },
    connect: { method: "POST", path: "/v1/projects/{project_id}/github", idempotent: true },
    get: { method: "GET", path: "/v1/projects/{project_id}/github" },
    branch_set: { method: "PATCH", path: "/v1/projects/{project_id}/github", idempotent: true },
    release_command_set: { method: "PUT", path: "/v1/projects/{project_id}/github/release_command", idempotent: true },
    disconnect: { method: "DELETE", path: "/v1/projects/{project_id}/github", idempotent: true },
    deploy: { method: "POST", path: "/v1/projects/{project_id}/github/deploy", idempotent: true },
  },
  app_db: {
    get: { method: "GET", path: "/v1/projects/{project_id}/database" },
    table_list: { method: "GET", path: "/v1/projects/{project_id}/database/tables" },
    table_rows: { method: "GET", path: "/v1/projects/{project_id}/database/tables/{table}" },
    backup_list: { method: "GET", path: "/v1/projects/{project_id}/database/backups" },
    backup_restore: { method: "POST", path: "/v1/projects/{project_id}/database/backups/{backup_id}/restore", idempotent: true },
  },
  cron: {
    create: { method: "POST", path: "/v1/projects/{project_id}/cron-jobs", idempotent: true },
    list: { method: "GET", path: "/v1/projects/{project_id}/cron-jobs" },
    update: { method: "PATCH", path: "/v1/cron-jobs/{cron_job_id}", idempotent: true },
    delete: { method: "DELETE", path: "/v1/cron-jobs/{cron_job_id}", idempotent: true },
    run_now: { method: "POST", path: "/v1/cron-jobs/{cron_job_id}/run", idempotent: true },
  },
  test_run: {
    start: { method: "POST", path: "/v1/projects/{project_id}/test-runs", idempotent: true },
    report: { method: "POST", path: "/v1/test-runs/{test_run_id}/results", idempotent: true },
    fix: { method: "PUT", path: "/v1/test-runs/{test_run_id}/fix", idempotent: true },
    rerun: { method: "POST", path: "/v1/test-runs/{test_run_id}/reruns", idempotent: true },
    list: { method: "GET", path: "/v1/projects/{project_id}/test-runs" },
    get: { method: "GET", path: "/v1/test-runs/{test_run_id}" },
    delete: { method: "DELETE", path: "/v1/test-runs/{test_run_id}", idempotent: true },
  },
  storage: {
    list: { method: "GET", path: "/v1/projects/{project_id}/storage", list: true },
    usage_get: { method: "GET", path: "/v1/workspaces/{workspace_id}/storage" },
    upload_sign: { method: "POST", path: "/v1/projects/{project_id}/storage/upload-url", idempotent: true },
    download_sign: { method: "GET", path: "/v1/projects/{project_id}/storage/download-url" },
    delete: { method: "DELETE", path: "/v1/projects/{project_id}/storage", idempotent: true },
  },
  token: {
    create: { method: "POST", path: "/v1/tokens", idempotent: true },
    list: { method: "GET", path: "/v1/tokens" },
    revoke: { method: "DELETE", path: "/v1/tokens/{token_id}", idempotent: true },
  },
  oauth: {
    grant_list: { method: "GET", path: "/v1/oauth/grants" },
    grant_revoke: { method: "DELETE", path: "/v1/oauth/grants/{grant_id}", idempotent: true },
  },
  credit: {
    balance_get: { method: "GET", path: "/v1/workspaces/{workspace_id}/credits" },
    ledger_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/credits/ledger" },
    cap_set: { method: "POST", path: "/v1/workspaces/{workspace_id}/credits/cap", idempotent: true },
    pack_list: { method: "GET", path: "/v1/credits/packs" },
    top_up_start: { method: "POST", path: "/v1/workspaces/{workspace_id}/credits/top-ups", idempotent: true },
    top_up_get: { method: "GET", path: "/v1/workspaces/{workspace_id}/credits/top-ups/{top_up_id}" },
    top_up_request: { method: "POST", path: "/v1/workspaces/{workspace_id}/credits/top-up-requests", idempotent: true },
    top_up_withdraw: { method: "POST", path: "/v1/workspaces/{workspace_id}/credits/top-ups/{top_up_id}/withdraw", idempotent: true },
  },
  billing: {
    get: { method: "GET", path: "/v1/workspaces/{workspace_id}/billing" },
    payment_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/billing/payments" },
    prices_get: { method: "GET", path: "/v1/billing/prices" },
    subscribe_start: { method: "POST", path: "/v1/workspaces/{workspace_id}/billing/subscribe", idempotent: true },
    subscribe_cancel: { method: "POST", path: "/v1/workspaces/{workspace_id}/billing/subscribe/cancel", idempotent: true },
    cancel: { method: "POST", path: "/v1/workspaces/{workspace_id}/billing/cancel", idempotent: true },
    resume: { method: "POST", path: "/v1/workspaces/{workspace_id}/billing/resume", idempotent: true },
    portal_open: { method: "POST", path: "/v1/workspaces/{workspace_id}/billing/portal" },
    withdraw: { method: "POST", path: "/v1/workspaces/{workspace_id}/billing/withdraw", idempotent: true },
  },
  change: {
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/changes" },
    command_get: { method: "GET", path: "/v1/commands/{command_id}/changes" },
    export: { method: "GET", path: "/v1/workspaces/{workspace_id}/changes/export" },
  },
  trash: {
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/trash" },
    erase: { method: "POST", path: "/v1/trash/{id}/erase", idempotent: true },
  },
  database: {
    create: { method: "POST", path: "/v1/workspaces/{workspace_id}/databases", idempotent: true },
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/databases" },
    rename: { method: "POST", path: "/v1/databases/{database_id}/rename", idempotent: true },
    archive: { method: "POST", path: "/v1/databases/{database_id}/archive", idempotent: true },
    restore: { method: "POST", path: "/v1/databases/{database_id}/restore", idempotent: true },
  },
  field: {
    create: { method: "POST", path: "/v1/databases/{database_id}/fields", idempotent: true },
    rename: { method: "POST", path: "/v1/fields/{field_id}/rename", idempotent: true },
    options_set: { method: "POST", path: "/v1/fields/{field_id}/options", idempotent: true },
    relation_set: { method: "POST", path: "/v1/fields/{field_id}/relation", idempotent: true },
    archive: { method: "POST", path: "/v1/fields/{field_id}/archive", idempotent: true },
    restore: { method: "POST", path: "/v1/fields/{field_id}/restore", idempotent: true },
  },
  record: {
    create: { method: "POST", path: "/v1/databases/{database_id}/records", idempotent: true },
    query: { method: "POST", path: "/v1/databases/{database_id}/query", list: true },
    get: { method: "GET", path: "/v1/records/{record_id}" },
    update: { method: "POST", path: "/v1/records/{record_id}", idempotent: true },
    subtasks_set: { method: "POST", path: "/v1/records/{record_id}/subtasks", idempotent: true },
    archive: { method: "POST", path: "/v1/records/{record_id}/archive", idempotent: true },
    restore: { method: "POST", path: "/v1/records/{record_id}/restore", idempotent: true },
    bulk_update: { method: "POST", path: "/v1/databases/{database_id}/records/bulk-update", idempotent: true },
    bulk_create: { method: "POST", path: "/v1/databases/{database_id}/records/bulk-create", idempotent: true },
    bulk_archive: { method: "POST", path: "/v1/databases/{database_id}/records/bulk-archive", idempotent: true },
    bulk_restore: { method: "POST", path: "/v1/databases/{database_id}/records/bulk-restore", idempotent: true },
    history: { method: "GET", path: "/v1/records/{record_id}/history" },
    undo: { method: "POST", path: "/v1/record-commands/{command_id}/undo", idempotent: true },
  },
  card: {
    move: { method: "POST", path: "/v1/records/{record_id}/move", idempotent: true },
    assigned_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/records/assigned", list: true },
  },
  task: {
    list: { method: "GET", path: "/v1/tasks", list: true },
    create: { method: "POST", path: "/v1/tasks", idempotent: true },
    bulk_create: { method: "POST", path: "/v1/tasks/bulk-create", idempotent: true },
    update: { method: "PATCH", path: "/v1/tasks/{task_id}", idempotent: true },
    move: { method: "POST", path: "/v1/tasks/{task_id}/move", idempotent: true },
  },
  view: {
    create: { method: "POST", path: "/v1/databases/{database_id}/views", idempotent: true },
    list: { method: "GET", path: "/v1/databases/{database_id}/views" },
    update: { method: "POST", path: "/v1/views/{view_id}", idempotent: true },
    rename: { method: "POST", path: "/v1/views/{view_id}/rename", idempotent: true },
    archive: { method: "POST", path: "/v1/views/{view_id}/archive", idempotent: true },
    restore: { method: "POST", path: "/v1/views/{view_id}/restore", idempotent: true },
    record_list: { method: "GET", path: "/v1/views/{view_id}/records", list: true },
  },
  page: {
    create: { method: "POST", path: "/v1/workspaces/{workspace_id}/pages", idempotent: true },
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/pages" },
    get: { method: "GET", path: "/v1/pages/{page_id}" },
    rename: { method: "POST", path: "/v1/pages/{page_id}/rename", idempotent: true },
    archive: { method: "POST", path: "/v1/pages/{page_id}/archive", idempotent: true },
    restore: { method: "POST", path: "/v1/pages/{page_id}/restore", idempotent: true },
    edit: { method: "POST", path: "/v1/pages/{page_id}/edit", idempotent: true },
    append: { method: "POST", path: "/v1/pages/{page_id}/blocks", idempotent: true },
    propose: { method: "POST", path: "/v1/pages/{page_id}/proposals", idempotent: true },
    proposal_get: { method: "GET", path: "/v1/pages/{page_id}/proposals/{proposal_id}" },
    proposal_list: { method: "GET", path: "/v1/pages/{page_id}/proposals" },
    proposal_discard: { method: "POST", path: "/v1/pages/{page_id}/proposals/{proposal_id}/discard", idempotent: true },
  },
  model: {
    list: { method: "GET", path: "/v1/models" },
  },
  command: {
    describe: { method: "GET", path: "/v1/commands/{name}" },
  },
  app_auth: {
    sign_up: { method: "POST", path: "/v1/projects/{project_id}/auth/sign-up", appServer: true },
    sign_in: { method: "POST", path: "/v1/projects/{project_id}/auth/sign-in", appServer: true },
    user_list: { method: "GET", path: "/v1/projects/{project_id}/auth/users", list: true },
    user_show: { method: "GET", path: "/v1/projects/{project_id}/auth/users/{user_id}" },
    user_unlock: { method: "POST", path: "/v1/projects/{project_id}/auth/users/{user_id}/unlock", idempotent: true },
    user_update: { method: "PATCH", path: "/v1/projects/{project_id}/auth/users/{user_id}", idempotent: true },
    user_confirm: { method: "POST", path: "/v1/projects/{project_id}/auth/users/{user_id}/confirm", idempotent: true },
    user_email_send: { method: "POST", path: "/v1/projects/{project_id}/auth/users/{user_id}/email", idempotent: true },
    user_session_list: { method: "GET", path: "/v1/projects/{project_id}/auth/users/{user_id}/sessions" },
    user_session_revoke: { method: "DELETE", path: "/v1/projects/{project_id}/auth/users/{user_id}/sessions/{session_id}", idempotent: true },
    user_sign_out_everywhere: { method: "POST", path: "/v1/projects/{project_id}/auth/users/{user_id}/sign-out", idempotent: true },
    sign_in_event_list: { method: "GET", path: "/v1/projects/{project_id}/auth/sign-ins" },
    sign_in_event_export: { method: "GET", path: "/v1/projects/{project_id}/auth/sign-ins/export" },
    user_delete: { method: "DELETE", path: "/v1/projects/{project_id}/auth/users/{user_id}", idempotent: true },
    settings_get: { method: "GET", path: "/v1/projects/{project_id}/auth/settings" },
    settings_update: { method: "POST", path: "/v1/projects/{project_id}/auth/settings", idempotent: true },
    email_send: { method: "POST", path: "/v1/projects/{project_id}/auth/email", appServer: true },
    email_usage_get: { method: "GET", path: "/v1/projects/{project_id}/auth/email-usage" },
    email_suppression_list: { method: "GET", path: "/v1/projects/{project_id}/auth/email-suppressions" },
    email_suppression_add: { method: "POST", path: "/v1/projects/{project_id}/auth/email-suppressions", idempotent: true },
    email_suppression_remove: { method: "POST", path: "/v1/projects/{project_id}/auth/email-suppressions/remove", idempotent: true },
    sender_get: { method: "GET", path: "/v1/projects/{project_id}/auth/sender" },
    email_preview_list: { method: "GET", path: "/v1/projects/{project_id}/auth/email-previews" },
    email_test_send: { method: "POST", path: "/v1/projects/{project_id}/auth/email-tests", idempotent: true },
    verify: { method: "POST", path: "/v1/projects/{project_id}/auth/verify", appServer: true },
    password_reset: { method: "POST", path: "/v1/projects/{project_id}/auth/password-reset", appServer: true },
  },
  email: {
    send: { method: "POST", path: "/v1/projects/{project_id}/email", idempotent: true },
  },
  app_payments: {
    connect_start: { method: "POST", path: "/v1/projects/{project_id}/payments/connect" },
    account_get: { method: "GET", path: "/v1/projects/{project_id}/payments/account" },
    revenue_get: { method: "GET", path: "/v1/projects/{project_id}/payments/revenue" },
    disconnect: { method: "DELETE", path: "/v1/projects/{project_id}/payments/account", idempotent: true },
    dashboard_link: { method: "GET", path: "/v1/projects/{project_id}/payments/dashboard" },
    webhook_delivery_list: { method: "GET", path: "/v1/projects/{project_id}/payments/deliveries" },
    webhook_delivery_resend: { method: "POST", path: "/v1/projects/{project_id}/payments/deliveries/{event_id}/resend", idempotent: true },
  },
  realtime: {
    publish: { method: "POST", path: "/v1/projects/{project_id}/realtime/channels/{channel}/messages" },
    channel_list: { method: "GET", path: "/v1/projects/{project_id}/realtime/channels" },
  },
  run: {
    create: { method: "POST", path: "/v1/runs", idempotent: true },
    quote: { method: "POST", path: "/v1/runs/quote" },
    list: { method: "GET", path: "/v1/runs", list: true },
    get: { method: "GET", path: "/v1/runs/{run_id}" },
    stop: { method: "POST", path: "/v1/runs/{run_id}/stop", idempotent: true },
    approval_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/approvals" },
    deny: { method: "POST", path: "/v1/runs/{run_id}/deny", idempotent: true },
    resume: { method: "POST", path: "/v1/runs/{run_id}/resume", idempotent: true },
    follow_up: { method: "POST", path: "/v1/runs/{run_id}/follow-up", idempotent: true },
    undo: { method: "POST", path: "/v1/runs/{run_id}/undo", idempotent: true },
  },
  agent: {
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/agents" },
    get: { method: "GET", path: "/v1/agents/{agent_id}" },
    update: { method: "PATCH", path: "/v1/agents/{agent_id}", idempotent: true },
    pause: { method: "POST", path: "/v1/agents/{agent_id}/pause", idempotent: true },
    resume: { method: "POST", path: "/v1/agents/{agent_id}/resume", idempotent: true },
  },
  schedule: {
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/schedules" },
    create: { method: "POST", path: "/v1/workspaces/{workspace_id}/schedules", idempotent: true },
    update: { method: "PATCH", path: "/v1/schedules/{schedule_id}", idempotent: true },
    delete: { method: "DELETE", path: "/v1/schedules/{schedule_id}", idempotent: true },
    restore: { method: "POST", path: "/v1/schedules/{schedule_id}/restore", idempotent: true },
    run_now: { method: "POST", path: "/v1/schedules/{schedule_id}/run", idempotent: true },
  },
  onboarding: {
    get: { method: "GET", path: "/v1/workspaces/{workspace_id}/onboarding" },
    step_skip: { method: "POST", path: "/v1/workspaces/{workspace_id}/onboarding/{step}/skip", idempotent: true },
    step_resume: { method: "POST", path: "/v1/workspaces/{workspace_id}/onboarding/{step}/resume", idempotent: true },
    starter_create: { method: "POST", path: "/v1/workspaces/{workspace_id}/onboarding/starter", idempotent: true },
    starter_remove: { method: "DELETE", path: "/v1/workspaces/{workspace_id}/onboarding/starter", idempotent: true },
  },
  notification: {
    list: { method: "GET", path: "/v1/workspaces/{workspace_id}/notifications", list: true },
    read: { method: "POST", path: "/v1/workspaces/{workspace_id}/notifications/read", idempotent: true },
    unread: { method: "POST", path: "/v1/workspaces/{workspace_id}/notifications/unread", idempotent: true },
    read_all: { method: "POST", path: "/v1/workspaces/{workspace_id}/notifications/read-all", idempotent: true },
    unread_count: { method: "GET", path: "/v1/workspaces/{workspace_id}/notifications/unread-count" },
    preferences_get: { method: "GET", path: "/v1/workspaces/{workspace_id}/notifications/preferences" },
    preferences_set: { method: "POST", path: "/v1/workspaces/{workspace_id}/notifications/preferences", idempotent: true },
  },
  search: {
    query: { method: "GET", path: "/v1/workspaces/{workspace_id}/search" },
  },
  comment: {
    create: { method: "POST", path: "/v1/records/{record_id}/comments", idempotent: true },
    list: { method: "GET", path: "/v1/records/{record_id}/comments", list: true },
    delete: { method: "DELETE", path: "/v1/comments/{comment_id}", idempotent: true },
    restore: { method: "POST", path: "/v1/comments/{comment_id}/restore", idempotent: true },
  },
  status: {
    get: { method: "GET", path: "/v1/status" },
    version_get: { method: "GET", path: "/v1/version" },
    incident_list: { method: "GET", path: "/v1/status/incidents" },
    incident_get: { method: "GET", path: "/v1/status/incidents/{incident_id}" },
  },
  deploy: {
    create: { method: "POST", path: "/v1/projects/{project_id}/deploys", idempotent: true },
    list: { method: "GET", path: "/v1/projects/{project_id}/deploys" },
    recent_list: { method: "GET", path: "/v1/workspaces/{workspace_id}/deploys" },
    get: { method: "GET", path: "/v1/deploys/{deploy_id}" },
    rollback: { method: "POST", path: "/v1/deploys/{deploy_id}/rollback", idempotent: true },
    logs: { method: "GET", path: "/v1/deploys/{deploy_id}/logs" },
  },
  domain: {
    add: { method: "POST", path: "/v1/projects/{project_id}/domains", idempotent: true },
    list: { method: "GET", path: "/v1/projects/{project_id}/domains" },
    check: { method: "POST", path: "/v1/domains/{domain_id}/check", idempotent: true },
    remove: { method: "DELETE", path: "/v1/domains/{domain_id}", idempotent: true },
  },
  webhook: {
    endpoint_create: { method: "POST", path: "/v1/projects/{project_id}/webhooks", idempotent: true },
    endpoint_list: { method: "GET", path: "/v1/projects/{project_id}/webhooks" },
    endpoint_update: { method: "PATCH", path: "/v1/webhooks/{endpoint_id}", idempotent: true },
    endpoint_delete: { method: "DELETE", path: "/v1/webhooks/{endpoint_id}", idempotent: true },
    delivery_list: { method: "GET", path: "/v1/projects/{project_id}/webhook-deliveries", list: true },
    delivery_resend: { method: "POST", path: "/v1/webhook-deliveries/{delivery_id}/resend", idempotent: true },
    endpoint_resend_failed: { method: "POST", path: "/v1/webhooks/{endpoint_id}/resend-failed", idempotent: true },
    endpoint_test: { method: "POST", path: "/v1/webhooks/{endpoint_id}/test", idempotent: true },
    endpoint_secret_rotate: { method: "POST", path: "/v1/webhooks/{endpoint_id}/secret", idempotent: true },
  },
} as const satisfies Record<string, Record<string, Route>>;

/** The client's methods: `scaffold.<resource>.<action>()` for each public command. */
export interface Methods {
  account: {
    /** Show the person you act for: name, email, signup time, how they sign in, the request's console session and any pending deletion. An ended console session answers 401 with why in the error's details. `GET /v1/account` */
    get(input?: Record<string, never>): Promise<operations["account.get"]["responses"][200]["content"]["application/json"]>;
  };
  image: {
    /** Read a logo or avatar by the image id ending its URL. `GET /v1/images/{image_id}` */
    get(input: operations["image.get"]["parameters"]["path"]): Promise<Blob>;
  };
  workspace: {
    /** Create a workspace on Free with you as its owner, named 1 to 80 characters and unlike your other workspaces. Each person owns one Free workspace: while you own one, upgrade it before creating another. Your first workspace gets your 50 starter credits once your email is verified. `POST /v1/workspaces` */
    create(input: NonNullable<operations["workspace.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.create"]["responses"][200]["content"]["application/json"]>;
    /** Rename a workspace you own. Its slug stays the same. `POST /v1/workspaces/{workspace_id}/rename` */
    rename(input: operations["workspace.rename"]["parameters"]["path"] & NonNullable<operations["workspace.rename"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.rename"]["responses"][200]["content"]["application/json"]>;
    /** Set or clear the logo of a workspace you own. `POST /v1/workspaces/{workspace_id}/logo` */
    logo_set(input: operations["workspace.logo_set"]["parameters"]["path"] & NonNullable<operations["workspace.logo_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.logo_set"]["responses"][200]["content"]["application/json"]>;
    /** Delete a workspace you own, unless a paid plan renews. `DELETE /v1/workspaces/{workspace_id}` */
    delete(input: operations["workspace.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.delete"]["responses"][200]["content"]["application/json"]>;
    /** Undo workspace.delete within 24 hours. A Free one waits while you own another Free workspace, as each person owns one. `POST /v1/workspaces/{workspace_id}/restore` */
    restore(input: operations["workspace.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.restore"]["responses"][200]["content"]["application/json"]>;
    /** Zip a workspace you own. workspace.export_get shows its progress and workspace.export_download returns the zip once it is ready. `POST /v1/workspaces/{workspace_id}/exports` */
    export_start(input: operations["workspace.export_start"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.export_start"]["responses"][200]["content"]["application/json"]>;
    /** An export's progress; the latest by default. `GET /v1/workspaces/{workspace_id}/export` */
    export_get(input: operations["workspace.export_get"]["parameters"]["path"] & NonNullable<operations["workspace.export_get"]["parameters"]["query"]>): Promise<operations["workspace.export_get"]["responses"][200]["content"]["application/json"]>;
    /** A ready export's zip, as base64. Needs write access, since it holds every project's database: download it only when the person asks for the export itself. `GET /v1/workspaces/{workspace_id}/exports/{export_id}/download` */
    export_download(input: operations["workspace.export_download"]["parameters"]["path"]): Promise<Blob>;
    /** List your workspaces and your role in each. `GET /v1/workspaces` */
    list(input?: NonNullable<operations["workspace.list"]["parameters"]["query"]>): Promise<operations["workspace.list"]["responses"][200]["content"]["application/json"]>;
    /** Invite an email to a workspace you own. Pass on the invite link secret it answers, shown only once. `POST /v1/workspaces/{workspace_id}/invites` */
    member_invite(input: operations["workspace.member_invite"]["parameters"]["path"] & NonNullable<operations["workspace.member_invite"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.member_invite"]["responses"][200]["content"]["application/json"]>;
    /** Revoke an open invite to a workspace you own, by its id from workspace.member_list. `DELETE /v1/invites/{invite_id}` */
    invite_revoke(input: operations["workspace.invite_revoke"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.invite_revoke"]["responses"][200]["content"]["application/json"]>;
    /** Undo a revoke before the invite expires. `POST /v1/invites/{invite_id}/restore` */
    invite_restore(input: operations["workspace.invite_restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.invite_restore"]["responses"][200]["content"]["application/json"]>;
    /** Hide a declined invite that workspace.member_list shows. `POST /v1/invites/{invite_id}/dismiss` */
    invite_dismiss(input: operations["workspace.invite_dismiss"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.invite_dismiss"]["responses"][200]["content"]["application/json"]>;
    /** Join a workspace by an invite sent to your account's email. `POST /v1/invites/accept` */
    invite_accept(input: NonNullable<operations["workspace.invite_accept"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.invite_accept"]["responses"][200]["content"]["application/json"]>;
    /** Turn down an invite sent to your account's email, by its secret. `POST /v1/invites/decline` */
    invite_decline(input: NonNullable<operations["workspace.invite_decline"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.invite_decline"]["responses"][200]["content"]["application/json"]>;
    /** Show an invite from its link secret, signed in or not, and whether it is still open. `POST /v1/invites/preview` */
    invite_get(input: NonNullable<operations["workspace.invite_get"]["requestBody"]>["content"]["application/json"]): Promise<operations["workspace.invite_get"]["responses"][200]["content"]["application/json"]>;
    /** List a workspace's members with roles, avatars and last activity, and its open invites. `GET /v1/workspaces/{workspace_id}/members` */
    member_list(input: operations["workspace.member_list"]["parameters"]["path"]): Promise<operations["workspace.member_list"]["responses"][200]["content"]["application/json"]>;
    /** Make a member the owner of a workspace you own. The plan stops using your card and billing details; the new owner adds theirs in the billing portal. `POST /v1/workspaces/{workspace_id}/transfer-ownership` */
    ownership_transfer(input: operations["workspace.ownership_transfer"]["parameters"]["path"] & NonNullable<operations["workspace.ownership_transfer"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["workspace.ownership_transfer"]["responses"][200]["content"]["application/json"]>;
    /** Remove a member from a workspace you own, or leave one with your own person_id. Revokes their tokens there. `DELETE /v1/workspaces/{workspace_id}/members/{person_id}` */
    member_remove(input: operations["workspace.member_remove"]["parameters"]["path"], options?: WriteOptions): Promise<operations["workspace.member_remove"]["responses"][200]["content"]["application/json"]>;
  };
  project: {
    /** Create a project in a workspace. Refused while a deleted one with the slug can be restored, unless ignore_restorable. A Free workspace holds 2 projects; server templates need the Paid plan. The static template starts with a starter page showing the project's name as its first upload, so deploy.create puts it live with nothing uploaded. `POST /v1/projects` */
    create(input: NonNullable<operations["project.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["project.create"]["responses"][200]["content"]["application/json"]>;
    /** List a workspace's projects, leaving out deleted ones. `GET /v1/projects` */
    list(input: NonNullable<operations["project.list"]["parameters"]["query"]>): List<operations["project.list"]["responses"][200]["content"]["application/json"], operations["project.list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Show a live project with its runtime, its newest deploy and, while Scaffold has it suspended, why and the statement of reasons to appeal. `GET /v1/projects/{project_id}` */
    get(input: operations["project.get"]["parameters"]["path"]): Promise<operations["project.get"]["responses"][200]["content"]["application/json"]>;
    /** Show a project's app users over 30 days and its costs this month: the credits of runs started for it, the hours its apps ran and what it stores. `GET /v1/projects/{project_id}/metrics` */
    metrics_get(input: operations["project.metrics_get"]["parameters"]["path"]): Promise<operations["project.metrics_get"]["responses"][200]["content"]["application/json"]>;
    /** Show the address a new project with this name would get and whether it is free. If not, project.create adds 4 random characters. `GET /v1/projects/address-check` */
    address_check(input: NonNullable<operations["project.address_check"]["parameters"]["query"]>): Promise<operations["project.address_check"]["responses"][200]["content"]["application/json"]>;
    /** Owner only: delete a project after a 24 hour grace period. `DELETE /v1/projects/{project_id}` */
    delete(input: operations["project.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["project.delete"]["responses"][200]["content"]["application/json"]>;
    /** Owner only: restore a deleted project within 24 hours of deleting it, unless its Free workspace holds its 2 projects already. `POST /v1/projects/{project_id}/restore` */
    restore(input: operations["project.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["project.restore"]["responses"][200]["content"]["application/json"]>;
    /** Owner only: erase a deleted project now instead of when its 24 hours run out, with its deploys, env, domains and database. `POST /v1/projects/{project_id}/erase` */
    erase(input: operations["project.erase"]["parameters"]["path"], options?: WriteOptions): Promise<operations["project.erase"]["responses"][200]["content"]["application/json"]>;
    /** Change a project's name, which the console and its app's emails show. Its slug and address stay. `POST /v1/projects/{project_id}/rename` */
    rename(input: operations["project.rename"]["parameters"]["path"] & NonNullable<operations["project.rename"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["project.rename"]["responses"][200]["content"]["application/json"]>;
    /** Set a project's one-line description, which the console shows under its name in the project list, or clear it with null or blank text. `PUT /v1/projects/{project_id}/description` */
    description_set(input: operations["project.description_set"]["parameters"]["path"] & NonNullable<operations["project.description_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["project.description_set"]["responses"][200]["content"]["application/json"]>;
    /** Show a project's requests, errors, p95 latency, unavailable requests and downtime per hour over the last 24 hours, all its deploys together. `GET /v1/projects/{project_id}/health` */
    health_get(input: operations["project.health_get"]["parameters"]["path"]): Promise<operations["project.health_get"]["responses"][200]["content"]["application/json"]>;
    /** Show whether each deploy a project's host keeps is awake, asleep or exited, with its wakes, sleeps, OOM kills and CPU. `GET /v1/projects/{project_id}/status` */
    status_get(input: operations["project.status_get"]["parameters"]["path"]): Promise<operations["project.status_get"]["responses"][200]["content"]["application/json"]>;
    /** Show the CPU, memory, disk, processes and sleep window a project's app runs under on its plan, and what its live deploy uses now. `GET /v1/projects/{project_id}/limits` */
    limits_get(input: operations["project.limits_get"]["parameters"]["path"]): Promise<operations["project.limits_get"]["responses"][200]["content"]["application/json"]>;
    /** Show the error share that alerts a project's owners, 1, 2 or 5%, and the alert firing now with its errors since it started. `GET /v1/projects/{project_id}/alerts` */
    alert_get(input: operations["project.alert_get"]["parameters"]["path"]): Promise<operations["project.alert_get"]["responses"][200]["content"]["application/json"]>;
    /** Set the error share over 5 minutes, 1, 2 or 5%, above which a project's owners get an email and an inbox item. Owners only, on the Paid plan. `PUT /v1/projects/{project_id}/alerts` */
    alert_set(input: operations["project.alert_set"]["parameters"]["path"] & NonNullable<operations["project.alert_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["project.alert_set"]["responses"][200]["content"]["application/json"]>;
    /** Turn a project's maintenance mode on or off, as its owner. While on, its address and domains show a maintenance page and its deploys keep running on their own addresses. `PUT /v1/projects/{project_id}/maintenance` */
    maintenance_set(input: operations["project.maintenance_set"]["parameters"]["path"] & NonNullable<operations["project.maintenance_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["project.maintenance_set"]["responses"][200]["content"]["application/json"]>;
    /** Move a project to another workspace, owning both. Its deploys, domains, env, database with its backups, files, source uploads, logs, cron jobs, webhooks and app users go with it and nothing goes offline. For someone else's workspace, make a claim link. A Free workspace takes no server code and holds 2 projects and 1 custom domain. `POST /v1/projects/{project_id}/move` */
    move(input: operations["project.move"]["parameters"]["path"] & NonNullable<operations["project.move"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["project.move"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: give a project's DATABASE_URL a new password and SCAFFOLD_STRIPE_WEBHOOK_SECRET a new value, so copies anyone kept stop working, and redeploy its live server app with them. Sessions opened with the old password end once a deploy with the new one is live, or within an hour. Removing a member and moving the project do this too. `POST /v1/projects/{project_id}/credentials/rotate` */
    credentials_rotate(input: operations["project.credentials_rotate"]["parameters"]["path"], options?: WriteOptions): Promise<operations["project.credentials_rotate"]["responses"][200]["content"]["application/json"]>;
    /** Make a claim link for a project you own, in place of any open one. The owner of another workspace who opens it moves the project there, once, within 7 days, with its backups, source uploads and logs. Its secret is answered only once. `POST /v1/projects/{project_id}/claim-link` */
    claim_link_create(input: operations["project.claim_link_create"]["parameters"]["path"]): Promise<operations["project.claim_link_create"]["responses"][200]["content"]["application/json"]>;
    /** Cancel a project's open claim link, so it no longer moves the project. `DELETE /v1/projects/{project_id}/claim-link` */
    claim_link_cancel(input: operations["project.claim_link_cancel"]["parameters"]["path"], options?: WriteOptions): Promise<operations["project.claim_link_cancel"]["responses"][200]["content"]["application/json"]>;
  };
  env: {
    /** Set a project's env var, encrypted at rest. A live server app is redeployed with it at once, without a rebuild, unless deploy is false. Setting several, pass deploy false on all but the last, so the app redeploys once. `POST /v1/projects/{project_id}/env` */
    set(input: operations["env.set"]["parameters"]["path"] & NonNullable<operations["env.set"]["requestBody"]>["content"]["application/json"]): Promise<operations["env.set"]["responses"][200]["content"]["application/json"]>;
    /** List a project's env vars. Secrets show their name, never their value. `GET /v1/projects/{project_id}/env` */
    list(input: operations["env.list"]["parameters"]["path"]): Promise<operations["env.list"]["responses"][200]["content"]["application/json"]>;
    /** Delete a project's env var by name. A live server app is redeployed without it, unless deploy is false; deploys made before keep their value for a rollback until the project is erased. `DELETE /v1/projects/{project_id}/env/{name}` */
    delete(input: operations["env.delete"]["parameters"]["path"] & NonNullable<operations["env.delete"]["parameters"]["query"]>, options?: WriteOptions): Promise<operations["env.delete"]["responses"][200]["content"]["application/json"]>;
    /** Undo a var's latest env.set: put back the value it replaced, or delete the var it created. A live server app is redeployed with that, unless deploy is false. `POST /v1/projects/{project_id}/env/{name}/restore` */
    restore(input: operations["env.restore"]["parameters"]["path"] & NonNullable<operations["env.restore"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["env.restore"]["responses"][200]["content"]["application/json"]>;
  };
  source: {
    /** Upload a project's code as one zip, stored once by its hash. Only the newest 5 uploads are kept, and uploading one again makes it the newest. The app's files sit at the zip's root, not in a folder: index.html for a static site, or package.json with a start script or main file for a Node app, without node_modules. `PUT /v1/projects/{project_id}/sources` */
    upload(input: operations["source.upload"]["parameters"]["path"] & { archive: Blob | ArrayBuffer | Uint8Array }, options?: WriteOptions): Promise<operations["source.upload"]["responses"][200]["content"]["application/json"]>;
    /** Upload a project's code as text files by path when you cannot send a zip. Scaffold zips them and stores the zip as source.upload does, under the same limits. Paths start at the app's root: index.html for a static site, or package.json with a start script or main file for a Node app, without node_modules. `POST /v1/projects/{project_id}/sources/files` */
    upload_files(input: operations["source.upload_files"]["parameters"]["path"] & NonNullable<operations["source.upload_files"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["source.upload_files"]["responses"][200]["content"]["application/json"]>;
    /** Delete a project's upload and its file. source.list gives each upload's sha256. `DELETE /v1/projects/{project_id}/sources/{sha256}` */
    delete(input: operations["source.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["source.delete"]["responses"][200]["content"]["application/json"]>;
    /** List a project's uploads of its code, newest first. An upload's sha256 is all deploy.create needs to build it. `GET /v1/projects/{project_id}/sources` */
    list(input: operations["source.list"]["parameters"]["path"]): Promise<operations["source.list"]["responses"][200]["content"]["application/json"]>;
    /** List the files in one of a project's uploads, by path. source.list or a deploy's source_sha256 gives the hash. `GET /v1/projects/{project_id}/sources/{sha256}/files` */
    file_list(input: operations["source.file_list"]["parameters"]["path"]): Promise<operations["source.file_list"]["responses"][200]["content"]["application/json"]>;
    /** Read one file of a project's upload. Text of at most 256 KB comes back whole; a binary or longer file comes back as its kind and size only. `GET /v1/projects/{project_id}/sources/{sha256}/file` */
    file_get(input: operations["source.file_get"]["parameters"]["path"] & NonNullable<operations["source.file_get"]["parameters"]["query"]>): Promise<operations["source.file_get"]["responses"][200]["content"]["application/json"]>;
  };
  github: {
    /** List the GitHub repositories a workspace linked, which its members reach and gave Scaffold's GitHub App, for github.connect. A person links repositories in the console, in a project's GitHub settings; an empty list means none is linked yet, so send the person there. `GET /v1/workspaces/{workspace_id}/github/repositories` */
    repository_list(input: operations["github.repository_list"]["parameters"]["path"]): Promise<operations["github.repository_list"]["responses"][200]["content"]["application/json"]>;
    /** Connect a project to a GitHub repository, so each push to its branch deploys. Replaces the repository it followed. `POST /v1/projects/{project_id}/github` */
    connect(input: operations["github.connect"]["parameters"]["path"] & NonNullable<operations["github.connect"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["github.connect"]["responses"][200]["content"]["application/json"]>;
    /** Show a project's GitHub repository and branch, and its latest pushes with the deploy each started. `GET /v1/projects/{project_id}/github` */
    get(input: operations["github.get"]["parameters"]["path"]): Promise<operations["github.get"]["responses"][200]["content"]["application/json"]>;
    /** Change the branch whose pushes deploy a project connected to GitHub. `PATCH /v1/projects/{project_id}/github` */
    branch_set(input: operations["github.branch_set"]["parameters"]["path"] & NonNullable<operations["github.branch_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["github.branch_set"]["responses"][200]["content"]["application/json"]>;
    /** Set the command, like a migration, that each pushed deploy of a project connected to GitHub runs before it goes live, after a dump of its database. Null for none. `PUT /v1/projects/{project_id}/github/release_command` */
    release_command_set(input: operations["github.release_command_set"]["parameters"]["path"] & NonNullable<operations["github.release_command_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["github.release_command_set"]["responses"][200]["content"]["application/json"]>;
    /** Stop deploying a project from GitHub. Its uploads and deploys stay. `DELETE /v1/projects/{project_id}/github` */
    disconnect(input: operations["github.disconnect"]["parameters"]["path"], options?: WriteOptions): Promise<operations["github.disconnect"]["responses"][200]["content"]["application/json"]>;
    /** Queue a deploy of the head of a connected project's branch now, as a push would. It answers queued: say so, check github.get when the person asks rather than in a loop, and call the URL live only once the deploy is. `POST /v1/projects/{project_id}/github/deploy` */
    deploy(input: operations["github.deploy"]["parameters"]["path"], options?: WriteOptions): Promise<operations["github.deploy"]["responses"][200]["content"]["application/json"]>;
  };
  app_db: {
    /** Show a project's Postgres database: its state, version, stored size, and DATABASE_URL with the password masked. `GET /v1/projects/{project_id}/database` */
    get(input: operations["app_db.get"]["parameters"]["path"]): Promise<operations["app_db.get"]["responses"][200]["content"]["application/json"]>;
    /** List the tables in a project's Postgres database with each one's estimated rows and stored size. It only reads. `GET /v1/projects/{project_id}/database/tables` */
    table_list(input: operations["app_db.table_list"]["parameters"]["path"]): Promise<operations["app_db.table_list"]["responses"][200]["content"]["application/json"]>;
    /** Read up to 50 rows of a table in a project's Postgres database, last first by primary key, optionally only those whose text holds a search, ignoring case. Each value comes as text cut to 500 characters. It runs in a read-only transaction of at most 5 seconds. `GET /v1/projects/{project_id}/database/tables/{table}` */
    table_rows(input: operations["app_db.table_rows"]["parameters"]["path"] & NonNullable<operations["app_db.table_rows"]["parameters"]["query"]>): Promise<operations["app_db.table_rows"]["responses"][200]["content"]["application/json"]>;
    /** Paid plan: list a project database's backups, newest first: daily at 03:00 UTC, before each restore and before each deploy's migrations, each kept 6 days. Also its latest restore and dump. `GET /v1/projects/{project_id}/database/backups` */
    backup_list(input: operations["app_db.backup_list"]["parameters"]["path"]): Promise<operations["app_db.backup_list"]["responses"][200]["content"]["application/json"]>;
    /** Paid plan, owners only: put a backup in place of everything in a project's database, which is read-only from when the restore starts until it ends. Rows written since are lost, so the current data is backed up first as undo_backup_id; restoring that backup undoes this. A restore that fails leaves the database as it was. `POST /v1/projects/{project_id}/database/backups/{backup_id}/restore` */
    backup_restore(input: operations["app_db.backup_restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_db.backup_restore"]["responses"][200]["content"]["application/json"]>;
  };
  cron: {
    /** Paid plan: POST to a path of the project's live app on a cron schedule, waking it if asleep. Each fire runs once, signed by a Scaffold-Signature JWT the project's JWKS verifies. At most 2 fires run at once per project and 8 per workspace; times that pass while one waits show as one missed fire, and the newest runs. `POST /v1/projects/{project_id}/cron-jobs` */
    create(input: operations["cron.create"]["parameters"]["path"] & NonNullable<operations["cron.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["cron.create"]["responses"][200]["content"]["application/json"]>;
    /** List a project's cron jobs with their next time and newest fires. `GET /v1/projects/{project_id}/cron-jobs` */
    list(input: operations["cron.list"]["parameters"]["path"]): Promise<operations["cron.list"]["responses"][200]["content"]["application/json"]>;
    /** Change a cron job's schedule, timezone or path, or pause and resume it. `PATCH /v1/cron-jobs/{cron_job_id}` */
    update(input: operations["cron.update"]["parameters"]["path"] & NonNullable<operations["cron.update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["cron.update"]["responses"][200]["content"]["application/json"]>;
    /** Delete a cron job and its fires. It answers the job as it was. `DELETE /v1/cron-jobs/{cron_job_id}` */
    delete(input: operations["cron.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["cron.delete"]["responses"][200]["content"]["application/json"]>;
    /** Paid plan: send one fire of a cron job now, waking the app as its schedule does, and wait for the app's answer. Its next time stays. `POST /v1/cron-jobs/{cron_job_id}/run` */
    run_now(input: operations["cron.run_now"]["parameters"]["path"], options?: WriteOptions): Promise<operations["cron.run_now"]["responses"][200]["content"]["application/json"]>;
  };
  test_run: {
    /** Start showing a test run of the project's code in the console, live: the command, who runs it and, when the runner knows, each test file and its test count. Report results with test_run.report as tests finish. `POST /v1/projects/{project_id}/test-runs` */
    start(input: operations["test_run.start"]["parameters"]["path"] & NonNullable<operations["test_run.start"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["test_run.start"]["responses"][200]["content"]["application/json"]>;
    /** Report tests that finished in a test run's latest attempt, up to 1,000 at once, each with its file, name, status and duration. done ends the attempt. A test reported again in the same attempt replaces its result. `POST /v1/test-runs/{test_run_id}/results` */
    report(input: operations["test_run.report"]["parameters"]["path"] & NonNullable<operations["test_run.report"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["test_run.report"]["responses"][200]["content"]["application/json"]>;
    /** Show what you are doing to fix a test run's failures, over its graph: the test file, a short note and the files you changed with lines added and removed. Each call replaces the last. `PUT /v1/test-runs/{test_run_id}/fix` */
    fix(input: operations["test_run.fix"]["parameters"]["path"] & NonNullable<operations["test_run.fix"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["test_run.fix"]["responses"][200]["content"]["application/json"]>;
    /** Start the next attempt of a test run once the last ended, of every file or the files named, then report it with test_run.report. A run reruns 19 times at most. `POST /v1/test-runs/{test_run_id}/reruns` */
    rerun(input: operations["test_run.rerun"]["parameters"]["path"] & NonNullable<operations["test_run.rerun"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["test_run.rerun"]["responses"][200]["content"]["application/json"]>;
    /** List a project's 20 newest test runs with their state and counts. `GET /v1/projects/{project_id}/test-runs` */
    list(input: operations["test_run.list"]["parameters"]["path"]): Promise<operations["test_run.list"]["responses"][200]["content"]["application/json"]>;
    /** Get a test run with every test's result in each attempt, the agent's fix and the files it changed. `GET /v1/test-runs/{test_run_id}` */
    get(input: operations["test_run.get"]["parameters"]["path"]): Promise<operations["test_run.get"]["responses"][200]["content"]["application/json"]>;
    /** Delete a test run and every result it holds. `DELETE /v1/test-runs/{test_run_id}` */
    delete(input: operations["test_run.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["test_run.delete"]["responses"][200]["content"]["application/json"]>;
  };
  storage: {
    /** List the files a project's app stores, by name, or only those whose name starts with prefix, like avatars/. `GET /v1/projects/{project_id}/storage` */
    list(input: operations["storage.list"]["parameters"]["path"] & NonNullable<operations["storage.list"]["parameters"]["query"]>): List<operations["storage.list"]["responses"][200]["content"]["application/json"], operations["storage.list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Show what the files of all a workspace's apps take together, and the cap its plan sets on them. Name a project to count its own files too. `GET /v1/workspaces/{workspace_id}/storage` */
    usage_get(input: operations["storage.usage_get"]["parameters"]["path"] & NonNullable<operations["storage.usage_get"]["parameters"]["query"]>): Promise<operations["storage.usage_get"]["responses"][200]["content"]["application/json"]>;
    /** Sign a URL that uploads one file of up to 50 MB to a project, for 15 minutes or expires_in_seconds: PUT the bytes to it with their Content-Type, from the app's server or a user's browser. A name a file holds already is refused. `POST /v1/projects/{project_id}/storage/upload-url` */
    upload_sign(input: operations["storage.upload_sign"]["parameters"]["path"] & NonNullable<operations["storage.upload_sign"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["storage.upload_sign"]["responses"][200]["content"]["application/json"]>;
    /** Sign a URL that downloads one of a project's files, for 15 minutes or expires_in_seconds, up to a week: link to it or put it in an img tag. `GET /v1/projects/{project_id}/storage/download-url` */
    download_sign(input: operations["storage.download_sign"]["parameters"]["path"] & NonNullable<operations["storage.download_sign"]["parameters"]["query"]>): Promise<operations["storage.download_sign"]["responses"][200]["content"]["application/json"]>;
    /** Delete a project's stored file by name, so signed URLs answer not found and its bytes no longer count toward the workspace's cap. `DELETE /v1/projects/{project_id}/storage` */
    delete(input: operations["storage.delete"]["parameters"]["path"] & NonNullable<operations["storage.delete"]["parameters"]["query"]>, options?: WriteOptions): Promise<operations["storage.delete"]["responses"][200]["content"]["application/json"]>;
  };
  token: {
    /** Create a token for a workspace, or a test one for your sandbox. Its secret is in this answer only: give it to the person once, or store it with env.set as a secret, and never repeat it later. `POST /v1/tokens` */
    create(input: NonNullable<operations["token.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["token.create"]["responses"][200]["content"]["application/json"]>;
    /** List the tokens of a workspace, revoked ones included, without secrets. `GET /v1/tokens` */
    list(input: NonNullable<operations["token.list"]["parameters"]["query"]>): Promise<operations["token.list"]["responses"][200]["content"]["application/json"]>;
    /** Revoke a token and every token it created, so their next request fails. A member may revoke only their own tokens, an owner any in the workspace. `DELETE /v1/tokens/{token_id}` */
    revoke(input: operations["token.revoke"]["parameters"]["path"], options?: WriteOptions): Promise<operations["token.revoke"]["responses"][200]["content"]["application/json"]>;
  };
  oauth: {
    /** List the OAuth apps you approved, and as an owner every app in your workspaces. `GET /v1/oauth/grants` */
    grant_list(input?: Record<string, never>): Promise<operations["oauth.grant_list"]["responses"][200]["content"]["application/json"]>;
    /** Revoke an OAuth app you approved, or as an owner any app in your workspace, so its next request fails. oauth.grant_list gives each grant_id. `DELETE /v1/oauth/grants/{grant_id}` */
    grant_revoke(input: operations["oauth.grant_revoke"]["parameters"]["path"], options?: WriteOptions): Promise<operations["oauth.grant_revoke"]["responses"][200]["content"]["application/json"]>;
  };
  credit: {
    /** Show a workspace's credits: balance, held, available and the monthly cap. `GET /v1/workspaces/{workspace_id}/credits` */
    balance_get(input: operations["credit.balance_get"]["parameters"]["path"]): Promise<operations["credit.balance_get"]["responses"][200]["content"]["application/json"]>;
    /** List a workspace's credit entries, newest first, 200 at a time, each agent run's entries naming the run. Pass the last entry's id as `before` for the next page. `GET /v1/workspaces/{workspace_id}/credits/ledger` */
    ledger_list(input: operations["credit.ledger_list"]["parameters"]["path"] & NonNullable<operations["credit.ledger_list"]["parameters"]["query"]>): Promise<operations["credit.ledger_list"]["responses"][200]["content"]["application/json"]>;
    /** Set or remove a workspace's monthly spending cap. Owners only. Raising or removing the cap lets runs spend past the limit the owner chose, so change it only when the person asks. `POST /v1/workspaces/{workspace_id}/credits/cap` */
    cap_set(input: operations["credit.cap_set"]["parameters"]["path"] & NonNullable<operations["credit.cap_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["credit.cap_set"]["responses"][200]["content"]["application/json"]>;
    /** List the credit packs a top-up can buy, with their prices. `GET /v1/credits/packs` */
    pack_list(input?: Record<string, never>): Promise<operations["credit.pack_list"]["responses"][200]["content"]["application/json"]>;
    /** Charge the card the plan is paid with, at once, for a credit pack. credit.pack_list lists the packs and their prices: tell the person the price first, and send it back as confirm_price. Owners only. `POST /v1/workspaces/{workspace_id}/credits/top-ups` */
    top_up_start(input: operations["credit.top_up_start"]["parameters"]["path"] & NonNullable<operations["credit.top_up_start"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["credit.top_up_start"]["responses"][200]["content"]["application/json"]>;
    /** Show whether a top-up was added, failed or still waits for the bank. `GET /v1/workspaces/{workspace_id}/credits/top-ups/{top_up_id}` */
    top_up_get(input: operations["credit.top_up_get"]["parameters"]["path"]): Promise<operations["credit.top_up_get"]["responses"][200]["content"]["application/json"]>;
    /** Ask the workspace's owners to top up, in their inbox. Members only, once a day. `POST /v1/workspaces/{workspace_id}/credits/top-up-requests` */
    top_up_request(input: operations["credit.top_up_request"]["parameters"]["path"], options?: WriteOptions): Promise<operations["credit.top_up_request"]["responses"][200]["content"]["application/json"]>;
    /** Withdraw from a top-up within 14 days and refund its unused credits, once any dispute ends. Owners only. `POST /v1/workspaces/{workspace_id}/credits/top-ups/{top_up_id}/withdraw` */
    top_up_withdraw(input: operations["credit.top_up_withdraw"]["parameters"]["path"], options?: WriteOptions): Promise<operations["credit.top_up_withdraw"]["responses"][200]["content"]["application/json"]>;
  };
  billing: {
    /** Show a workspace's plan, Free or Paid: price, card, renewal or end, a failed renewal's fix-by date, withdrawal deadlines and any unpaid payment page. `GET /v1/workspaces/{workspace_id}/billing` */
    get(input: operations["billing.get"]["parameters"]["path"]): Promise<operations["billing.get"]["responses"][200]["content"]["application/json"]>;
    /** List what a workspace paid Scaffold, newest first: plan payments, top-ups and their refunds, each with its date, amount and what it paid for. `GET /v1/workspaces/{workspace_id}/billing/payments` */
    payment_list(input: operations["billing.payment_list"]["parameters"]["path"]): Promise<operations["billing.payment_list"]["responses"][200]["content"]["application/json"]>;
    /** Show yearly and monthly Paid plan prices before tax, the credits each grants a month (null when it grants none), and the 14-day withdrawal charge per credit. `GET /v1/billing/prices` */
    prices_get(input?: Record<string, never>): Promise<operations["billing.prices_get"]["responses"][200]["content"]["application/json"]>;
    /** Open a Stripe payment page for the paid plan, yearly or monthly, which grants nothing before Stripe confirms. Owners only, on the free plan. `POST /v1/workspaces/{workspace_id}/billing/subscribe` */
    subscribe_start(input: operations["billing.subscribe_start"]["parameters"]["path"] & NonNullable<operations["billing.subscribe_start"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["billing.subscribe_start"]["responses"][200]["content"]["application/json"]>;
    /** Give up on the plan's unpaid Stripe payment page, so it can no longer be paid. Owners only. `POST /v1/workspaces/{workspace_id}/billing/subscribe/cancel` */
    subscribe_cancel(input: operations["billing.subscribe_cancel"]["parameters"]["path"], options?: WriteOptions): Promise<operations["billing.subscribe_cancel"]["responses"][200]["content"]["application/json"]>;
    /** End the Paid plan when its paid period ends. Owners only. `POST /v1/workspaces/{workspace_id}/billing/cancel` */
    cancel(input: operations["billing.cancel"]["parameters"]["path"], options?: WriteOptions): Promise<operations["billing.cancel"]["responses"][200]["content"]["application/json"]>;
    /** Keep a cancelled Paid plan, so it renews again. Owners only, before its period ends. `POST /v1/workspaces/{workspace_id}/billing/resume` */
    resume(input: operations["billing.resume"]["parameters"]["path"], options?: WriteOptions): Promise<operations["billing.resume"]["responses"][200]["content"]["application/json"]>;
    /** Open Stripe's billing portal to change or cancel the plan. Owners only, once the workspace subscribed. `POST /v1/workspaces/{workspace_id}/billing/portal` */
    portal_open(input: operations["billing.portal_open"]["parameters"]["path"]): Promise<operations["billing.portal_open"]["responses"][200]["content"]["application/json"]>;
    /** Withdraw from the paid plan within 14 days of subscribing: cancel it now and refund it, less the credits used if the owner asked to start at once, once any dispute ends. Owners only. `POST /v1/workspaces/{workspace_id}/billing/withdraw` */
    withdraw(input: operations["billing.withdraw"]["parameters"]["path"], options?: WriteOptions): Promise<operations["billing.withdraw"]["responses"][200]["content"]["application/json"]>;
  };
  change: {
    /** List what changed in a workspace, newest first, 100 at a time. Pass the last position you saw as after to catch up oldest first. Narrow it with words to find in each change and a from and to time. `GET /v1/workspaces/{workspace_id}/changes` */
    list(input: operations["change.list"]["parameters"]["path"] & NonNullable<operations["change.list"]["parameters"]["query"]>): Promise<operations["change.list"]["responses"][200]["content"]["application/json"]>;
    /** List the record versions one command made, before and after. `GET /v1/commands/{command_id}/changes` */
    command_get(input: operations["change.command_get"]["parameters"]["path"]): Promise<operations["change.command_get"]["responses"][200]["content"]["application/json"]>;
    /** Export a workspace's changes as CSV. Owners only. `GET /v1/workspaces/{workspace_id}/changes/export` */
    export(input: operations["change.export"]["parameters"]["path"] & NonNullable<operations["change.export"]["parameters"]["query"]>): Promise<operations["change.export"]["responses"][200]["content"]["application/json"]>;
  };
  trash: {
    /** List what was deleted in a workspace and can still be restored, with the commands that restore it and, for an owner, erase it now. `GET /v1/workspaces/{workspace_id}/trash` */
    list(input: operations["trash.list"]["parameters"]["path"] & NonNullable<operations["trash.list"]["parameters"]["query"]>): Promise<operations["trash.list"]["responses"][200]["content"]["application/json"]>;
    /** Owner only: erase an archived page or database now instead of after its 30 days, with its content and history, and a database with its records, fields and views. Relation fields of other databases lose their links to it. A deleted project is erased with project.erase. `POST /v1/trash/{id}/erase` */
    erase(input: operations["trash.erase"]["parameters"]["path"], options?: WriteOptions): Promise<operations["trash.erase"]["responses"][200]["content"]["application/json"]>;
  };
  database: {
    /** Create a database, which keeps a Title field; add each field asked for with field.create. `POST /v1/workspaces/{workspace_id}/databases` */
    create(input: operations["database.create"]["parameters"]["path"] & NonNullable<operations["database.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["database.create"]["responses"][200]["content"]["application/json"]>;
    /** List a workspace's databases with their fields and option ids. `GET /v1/workspaces/{workspace_id}/databases` */
    list(input: operations["database.list"]["parameters"]["path"] & NonNullable<operations["database.list"]["parameters"]["query"]>): Promise<operations["database.list"]["responses"][200]["content"]["application/json"]>;
    /** Rename a database. `POST /v1/databases/{database_id}/rename` */
    rename(input: operations["database.rename"]["parameters"]["path"] & NonNullable<operations["database.rename"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["database.rename"]["responses"][200]["content"]["application/json"]>;
    /** Archive a database, hiding it from database.list unless include_archived. It is erased after 30 days, and relation fields lose their links to it. `POST /v1/databases/{database_id}/archive` */
    archive(input: operations["database.archive"]["parameters"]["path"], options?: WriteOptions): Promise<operations["database.archive"]["responses"][200]["content"]["application/json"]>;
    /** Restore an archived database. `POST /v1/databases/{database_id}/restore` */
    restore(input: operations["database.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["database.restore"]["responses"][200]["content"]["application/json"]>;
  };
  field: {
    /** Add a typed field to a database; its kind cannot change later. A select or multi_select takes options, a relation its relation_database_id. `POST /v1/databases/{database_id}/fields` */
    create(input: operations["field.create"]["parameters"]["path"] & NonNullable<operations["field.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["field.create"]["responses"][200]["content"]["application/json"]>;
    /** Rename a field. Record values stay keyed by its id. `POST /v1/fields/{field_id}/rename` */
    rename(input: operations["field.rename"]["parameters"]["path"] & NonNullable<operations["field.rename"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["field.rename"]["responses"][200]["content"]["application/json"]>;
    /** Set a select or multi_select field's options in order: keep or rename one by id, add one without. One left out is removed, refused while any record holds it, archived ones too. `POST /v1/fields/{field_id}/options` */
    options_set(input: operations["field.options_set"]["parameters"]["path"] & NonNullable<operations["field.options_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["field.options_set"]["responses"][200]["content"]["application/json"]>;
    /** Set the database a relation field links to, refused while records link through it, and two_way: whether that database shows its links back. `POST /v1/fields/{field_id}/relation` */
    relation_set(input: operations["field.relation_set"]["parameters"]["path"] & NonNullable<operations["field.relation_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["field.relation_set"]["responses"][200]["content"]["application/json"]>;
    /** Archive a field, hiding its values. Search stops finding a text field's values within moments. `POST /v1/fields/{field_id}/archive` */
    archive(input: operations["field.archive"]["parameters"]["path"], options?: WriteOptions): Promise<operations["field.archive"]["responses"][200]["content"]["application/json"]>;
    /** Restore an archived field and show its values again. Search finds a text field's values again within moments. `POST /v1/fields/{field_id}/restore` */
    restore(input: operations["field.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["field.restore"]["responses"][200]["content"]["application/json"]>;
  };
  record: {
    /** Add a record to a database, with values keyed by field id. `POST /v1/databases/{database_id}/records` */
    create(input: operations["record.create"]["parameters"]["path"] & NonNullable<operations["record.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.create"]["responses"][200]["content"]["application/json"]>;
    /** Filter, sort and page a database's records. `POST /v1/databases/{database_id}/query` */
    query(input: operations["record.query"]["parameters"]["path"] & NonNullable<operations["record.query"]["requestBody"]>["content"]["application/json"]): List<operations["record.query"]["responses"][200]["content"]["application/json"], operations["record.query"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Show a record with its version, live field values and subtasks. `GET /v1/records/{record_id}` */
    get(input: operations["record.get"]["parameters"]["path"]): Promise<operations["record.get"]["responses"][200]["content"]["application/json"]>;
    /** Change a record's values at the version you read. `POST /v1/records/{record_id}` */
    update(input: operations["record.update"]["parameters"]["path"] & NonNullable<operations["record.update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.update"]["responses"][200]["content"]["application/json"]>;
    /** Replace a record's subtasks with this checklist. `POST /v1/records/{record_id}/subtasks` */
    subtasks_set(input: operations["record.subtasks_set"]["parameters"]["path"] & NonNullable<operations["record.subtasks_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.subtasks_set"]["responses"][200]["content"]["application/json"]>;
    /** Archive a record at the version you read. `POST /v1/records/{record_id}/archive` */
    archive(input: operations["record.archive"]["parameters"]["path"] & NonNullable<operations["record.archive"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.archive"]["responses"][200]["content"]["application/json"]>;
    /** Restore an archived record at the version you read. `POST /v1/records/{record_id}/restore` */
    restore(input: operations["record.restore"]["parameters"]["path"] & NonNullable<operations["record.restore"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.restore"]["responses"][200]["content"]["application/json"]>;
    /** Change records of one database in one command, each update shaped like record.update's input. `POST /v1/databases/{database_id}/records/bulk-update` */
    bulk_update(input: operations["record.bulk_update"]["parameters"]["path"] & NonNullable<operations["record.bulk_update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.bulk_update"]["responses"][200]["content"]["application/json"]>;
    /** Add records to one database in one command. `POST /v1/databases/{database_id}/records/bulk-create` */
    bulk_create(input: operations["record.bulk_create"]["parameters"]["path"] & NonNullable<operations["record.bulk_create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.bulk_create"]["responses"][200]["content"]["application/json"]>;
    /** Archive records of one database in one command. `POST /v1/databases/{database_id}/records/bulk-archive` */
    bulk_archive(input: operations["record.bulk_archive"]["parameters"]["path"] & NonNullable<operations["record.bulk_archive"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.bulk_archive"]["responses"][200]["content"]["application/json"]>;
    /** Restore archived records of one database in one command. `POST /v1/databases/{database_id}/records/bulk-restore` */
    bulk_restore(input: operations["record.bulk_restore"]["parameters"]["path"] & NonNullable<operations["record.bulk_restore"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["record.bulk_restore"]["responses"][200]["content"]["application/json"]>;
    /** List a record's versions, newest first, 100 at a time, each with who made it, its command_id and each changed field before and after. `GET /v1/records/{record_id}/history` */
    history(input: operations["record.history"]["parameters"]["path"] & NonNullable<operations["record.history"]["parameters"]["query"]>): Promise<operations["record.history"]["responses"][200]["content"]["application/json"]>;
    /** Undo one command's record changes by its command_id. Refused as a conflict if any of its records changed since. Undoing an undo redoes it. `POST /v1/record-commands/{command_id}/undo` */
    undo(input: operations["record.undo"]["parameters"]["path"], options?: WriteOptions): Promise<operations["record.undo"]["responses"][200]["content"]["application/json"]>;
  };
  card: {
    /** Move a record at the version you read, like a board card, after or before another of its database, setting values in the same write. Without after or before it stays put. `POST /v1/records/{record_id}/move` */
    move(input: operations["card.move"]["parameters"]["path"] & NonNullable<operations["card.move"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["card.move"]["responses"][200]["content"]["application/json"]>;
    /** List a workspace's open or done records that name you in a person field, across its databases. `GET /v1/workspaces/{workspace_id}/records/assigned` */
    assigned_list(input: operations["card.assigned_list"]["parameters"]["path"] & NonNullable<operations["card.assigned_list"]["parameters"]["query"]>): List<operations["card.assigned_list"]["responses"][200]["content"]["application/json"], operations["card.assigned_list"]["responses"][200]["content"]["application/json"]["data"][number]>;
  };
  task: {
    /** List a workspace's tasks, newest first. `GET /v1/tasks` */
    list(input: NonNullable<operations["task.list"]["parameters"]["query"]>): List<operations["task.list"]["responses"][200]["content"]["application/json"], operations["task.list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Add a task. New labels stay after its undo. `POST /v1/tasks` */
    create(input: NonNullable<operations["task.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["task.create"]["responses"][200]["content"]["application/json"]>;
    /** Add 1 to 100 tasks to one Tasks database in one command, each shaped like task.create's input without workspace_id and database_id. For a single task, use task.create. New labels stay after its undo. `POST /v1/tasks/bulk-create` */
    bulk_create(input: NonNullable<operations["task.bulk_create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["task.bulk_create"]["responses"][200]["content"]["application/json"]>;
    /** Change a task's title, assignee or due date; null clears one. `PATCH /v1/tasks/{task_id}` */
    update(input: operations["task.update"]["parameters"]["path"] & NonNullable<operations["task.update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["task.update"]["responses"][200]["content"]["application/json"]>;
    /** Move a task to a column, at a position in it. `POST /v1/tasks/{task_id}/move` */
    move(input: operations["task.move"]["parameters"]["path"] & NonNullable<operations["task.move"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["task.move"]["responses"][200]["content"]["application/json"]>;
  };
  view: {
    /** Save a view of a database. A board needs group_by, a timeline its dates, a sprint view its sprint source. `POST /v1/databases/{database_id}/views` */
    create(input: operations["view.create"]["parameters"]["path"] & NonNullable<operations["view.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["view.create"]["responses"][200]["content"]["application/json"]>;
    /** List a database's views with their settings, oldest first. `GET /v1/databases/{database_id}/views` */
    list(input: operations["view.list"]["parameters"]["path"] & NonNullable<operations["view.list"]["parameters"]["query"]>): Promise<operations["view.list"]["responses"][200]["content"]["application/json"]>;
    /** Replace a view's settings; its name stays. `POST /v1/views/{view_id}` */
    update(input: operations["view.update"]["parameters"]["path"] & NonNullable<operations["view.update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["view.update"]["responses"][200]["content"]["application/json"]>;
    /** Rename a view. `POST /v1/views/{view_id}/rename` */
    rename(input: operations["view.rename"]["parameters"]["path"] & NonNullable<operations["view.rename"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["view.rename"]["responses"][200]["content"]["application/json"]>;
    /** Archive a view, hiding it from view.list unless include_archived. `POST /v1/views/{view_id}/archive` */
    archive(input: operations["view.archive"]["parameters"]["path"], options?: WriteOptions): Promise<operations["view.archive"]["responses"][200]["content"]["application/json"]>;
    /** Restore an archived view. `POST /v1/views/{view_id}/restore` */
    restore(input: operations["view.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["view.restore"]["responses"][200]["content"]["application/json"]>;
    /** Page a view's records as its settings show them: a board column by group, a timeline from and to, my tasks for you, or the current sprint's records with that sprint. `GET /v1/views/{view_id}/records` */
    record_list(input: operations["view.record_list"]["parameters"]["path"] & NonNullable<operations["view.record_list"]["parameters"]["query"]>): List<operations["view.record_list"]["responses"][200]["content"]["application/json"], operations["view.record_list"]["responses"][200]["content"]["application/json"]["data"][number]>;
  };
  page: {
    /** Create a page in a workspace, or a record's body with record_id. `POST /v1/workspaces/{workspace_id}/pages` */
    create(input: operations["page.create"]["parameters"]["path"] & NonNullable<operations["page.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["page.create"]["responses"][200]["content"]["application/json"]>;
    /** List a workspace's pages, oldest first, without blocks. `GET /v1/workspaces/{workspace_id}/pages` */
    list(input: operations["page.list"]["parameters"]["path"] & NonNullable<operations["page.list"]["parameters"]["query"]>): Promise<operations["page.list"]["responses"][200]["content"]["application/json"]>;
    /** Read a page as Markdown, or with format blocks as blocks with stable ids, types, props, styled text and children, which page.edit targets. `GET /v1/pages/{page_id}` */
    get(input: operations["page.get"]["parameters"]["path"] & NonNullable<operations["page.get"]["parameters"]["query"]>): Promise<operations["page.get"]["responses"][200]["content"]["application/json"]>;
    /** Set a standalone page's title. A record's body has no title, since the record names it. `POST /v1/pages/{page_id}/rename` */
    rename(input: operations["page.rename"]["parameters"]["path"] & NonNullable<operations["page.rename"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["page.rename"]["responses"][200]["content"]["application/json"]>;
    /** Archive a page: it leaves page.list, takes no edits and is erased after 30 days. A record's body goes with its record through record.archive instead. `POST /v1/pages/{page_id}/archive` */
    archive(input: operations["page.archive"]["parameters"]["path"], options?: WriteOptions): Promise<operations["page.archive"]["responses"][200]["content"]["application/json"]>;
    /** Restore an archived page with the content it had. `POST /v1/pages/{page_id}/restore` */
    restore(input: operations["page.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["page.restore"]["responses"][200]["content"]["application/json"]>;
    /** Change a page's blocks by id with 1 to 100 ops that insert, update or delete blocks. An edit of over 10 blocks, or with preview true, changes nothing and answers each block before and after with a confirm token; send the same ops with it to apply them. It answers new block ids and the ops that undo it. An edit that could not be undone is refused, like deleting over about 256 KiB at once, so delete big sections in steps. `POST /v1/pages/{page_id}/edit` */
    edit(input: operations["page.edit"]["parameters"]["path"] & NonNullable<operations["page.edit"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["page.edit"]["responses"][200]["content"]["application/json"]>;
    /** Add Markdown at the end of a page or after a block. <@usr_...> mentions a member; an image alone in its paragraph adds an image block. `POST /v1/pages/{page_id}/blocks` */
    append(input: operations["page.append"]["parameters"]["path"] & NonNullable<operations["page.append"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["page.append"]["responses"][200]["content"]["application/json"]>;
    /** Propose a rewrite of a page with ops as page.edit takes them, for a person to accept or discard in the console. Nothing changes until they accept it, so propose rewrites a person should see first. `POST /v1/pages/{page_id}/proposals` */
    propose(input: operations["page.propose"]["parameters"]["path"] & NonNullable<operations["page.propose"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["page.propose"]["responses"][200]["content"]["application/json"]>;
    /** Read a proposed rewrite of a page. While it is open it answers the page's blocks now and as accepting it would leave them, or that it is stale since a block it rewrites changed. `GET /v1/pages/{page_id}/proposals/{proposal_id}` */
    proposal_get(input: operations["page.proposal_get"]["parameters"]["path"]): Promise<operations["page.proposal_get"]["responses"][200]["content"]["application/json"]>;
    /** List the proposed rewrites of a page that wait for a person, oldest first. `GET /v1/pages/{page_id}/proposals` */
    proposal_list(input: operations["page.proposal_list"]["parameters"]["path"]): Promise<operations["page.proposal_list"]["responses"][200]["content"]["application/json"]>;
    /** Discard a proposed rewrite of a page and leave the page as it is. It answers the proposal's ops, which page.propose takes to propose it again. `POST /v1/pages/{page_id}/proposals/{proposal_id}/discard` */
    proposal_discard(input: operations["page.proposal_discard"]["parameters"]["path"], options?: WriteOptions): Promise<operations["page.proposal_discard"]["responses"][200]["content"]["application/json"]>;
  };
  model: {
    /** List the models runs may use, their token prices now in millicredits per million, and the price version. `GET /v1/models` */
    list(input?: Record<string, never>): Promise<operations["model.list"]["responses"][200]["content"]["application/json"]>;
  };
  command: {
    /** Describe a command by its catalog or MCP name: its MCP tool and action, what it does, how to undo it and the JSON schema of its input. `GET /v1/commands/{name}` */
    describe(input: operations["command.describe"]["parameters"]["path"]): Promise<operations["command.describe"]["responses"][200]["content"]["application/json"]>;
  };
  app_auth: {
    /** Create a user of a project's app with email and password, and email them a link and a 6-digit code that confirm their address and sign them in through app_auth.verify. Their password signs them in only once they have confirmed. The same email in another project is another user. An address that already has a user gets the same answer, with an id no user has, and no email, so sign-up reveals no user. A user who has not confirmed 7 days after signing up or their last auth email is deleted, and the address can sign up again. `POST /v1/projects/{project_id}/auth/sign-up` */
    sign_up(input: operations["app_auth.sign_up"]["parameters"]["path"] & NonNullable<operations["app_auth.sign_up"]["requestBody"]>["content"]["application/json"], options?: AppServerOptions): Promise<operations["app_auth.sign_up"]["responses"][200]["content"]["application/json"]>;
    /** Sign a user in to a project's app with email and password, once they have confirmed their email, answering a one hour access token and a refresh token. `POST /v1/projects/{project_id}/auth/sign-in` */
    sign_in(input: operations["app_auth.sign_in"]["parameters"]["path"] & NonNullable<operations["app_auth.sign_in"]["requestBody"]>["content"]["application/json"], options?: AppServerOptions): Promise<operations["app_auth.sign_in"]["responses"][200]["content"]["application/json"]>;
    /** List a project's app users in id order, a page at a time, with their status, last sign-in and live sessions, filtered by name or email and status. Counts the matches and all users. `GET /v1/projects/{project_id}/auth/users` */
    user_list(input: operations["app_auth.user_list"]["parameters"]["path"] & NonNullable<operations["app_auth.user_list"]["parameters"]["query"]>): List<operations["app_auth.user_list"]["responses"][200]["content"]["application/json"], operations["app_auth.user_list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Show one app user: status, lock end, sign-up, last sign-in, sign-in methods and, while unconfirmed, when they are deleted. `GET /v1/projects/{project_id}/auth/users/{user_id}` */
    user_show(input: operations["app_auth.user_show"]["parameters"]["path"]): Promise<operations["app_auth.user_show"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: end the 15-minute lock five wrong passwords put on an app user's email. `POST /v1/projects/{project_id}/auth/users/{user_id}/unlock` */
    user_unlock(input: operations["app_auth.user_unlock"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_auth.user_unlock"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: correct an app user's name or email, like a mistyped address. A new email makes them unverified and emails it a confirmation: until they confirm, their password does not sign them in, links sent before stop working, and they are deleted 7 days after it unless they confirm. Run it again with the old values to undo it; an email changed back needs confirming again, by the user or app_auth.user_confirm. `PATCH /v1/projects/{project_id}/auth/users/{user_id}` */
    user_update(input: operations["app_auth.user_update"]["parameters"]["path"] & NonNullable<operations["app_auth.user_update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["app_auth.user_update"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: mark an app user's email confirmed without their confirmation, for an address you know is theirs. Scaffold then keeps them and the password they signed up with signs them in. The history records who did it. `POST /v1/projects/{project_id}/auth/users/{user_id}/confirm` */
    user_confirm(input: operations["app_auth.user_confirm"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_auth.user_confirm"]["responses"][200]["content"]["application/json"]>;
    /** Email an app user a password reset, or their unconfirmed address's confirmation again. At most one of each a minute, counted like the user's own requests: 3 auth emails an hour per address, and the workspace's monthly quota while the address is unproven. `POST /v1/projects/{project_id}/auth/users/{user_id}/email` */
    user_email_send(input: operations["app_auth.user_email_send"]["parameters"]["path"] & NonNullable<operations["app_auth.user_email_send"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["app_auth.user_email_send"]["responses"][200]["content"]["application/json"]>;
    /** List an app user's live sessions with the device and place each signed in from. `GET /v1/projects/{project_id}/auth/users/{user_id}/sessions` */
    user_session_list(input: operations["app_auth.user_session_list"]["parameters"]["path"]): Promise<operations["app_auth.user_session_list"]["responses"][200]["content"]["application/json"]>;
    /** End one of an app user's sessions. `DELETE /v1/projects/{project_id}/auth/users/{user_id}/sessions/{session_id}` */
    user_session_revoke(input: operations["app_auth.user_session_revoke"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_auth.user_session_revoke"]["responses"][200]["content"]["application/json"]>;
    /** End every session of an app user. `POST /v1/projects/{project_id}/auth/users/{user_id}/sign-out` */
    user_sign_out_everywhere(input: operations["app_auth.user_sign_out_everywhere"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_auth.user_sign_out_everywhere"]["responses"][200]["content"]["application/json"]>;
    /** List a project's app sign-in events of the last 90 days, newest first, 100 at a time: sign-ups, sign-ins, wrong passwords, locks, emails and sign-outs, with place and IP. `GET /v1/projects/{project_id}/auth/sign-ins` */
    sign_in_event_list(input: operations["app_auth.sign_in_event_list"]["parameters"]["path"] & NonNullable<operations["app_auth.sign_in_event_list"]["parameters"]["query"]>): Promise<operations["app_auth.sign_in_event_list"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: download every app sign-in event a project keeps, the last 90 days, as JSON, newest first, with place and IP. `GET /v1/projects/{project_id}/auth/sign-ins/export` */
    sign_in_event_export(input: operations["app_auth.sign_in_event_export"]["parameters"]["path"]): Promise<operations["app_auth.sign_in_event_export"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: delete an app user. Their email, password and sign-in history are erased and every session ends. `DELETE /v1/projects/{project_id}/auth/users/{user_id}` */
    user_delete(input: operations["app_auth.user_delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_auth.user_delete"]["responses"][200]["content"]["application/json"]>;
    /** Show where a project's auth emails may link to. `GET /v1/projects/{project_id}/auth/settings` */
    settings_get(input: operations["app_auth.settings_get"]["parameters"]["path"]): Promise<operations["app_auth.settings_get"]["responses"][200]["content"]["application/json"]>;
    /** Replace the site URL a project's auth emails link to and the other URLs they may. `POST /v1/projects/{project_id}/auth/settings` */
    settings_update(input: operations["app_auth.settings_update"]["parameters"]["path"] & NonNullable<operations["app_auth.settings_update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["app_auth.settings_update"]["responses"][200]["content"]["application/json"]>;
    /** Email an app user a link and a 6-digit code: to confirm their address, to sign in without a password (creating the user if the address is new), or to reset a forgotten password. The answer is the same for any address, and the proof works for an hour. Each address takes at most 3 requests an hour at a project and 10 at every app together, sent or not, and one network address may ask a project for 20 an hour (100 for all of an IPv6 /48), sign-ups included; past any it answers cap_reached. Calls with no network address share one such 20 per project. The app's own server may pass each user's address with its secret, and then gets 500 an hour. `POST /v1/projects/{project_id}/auth/email` */
    email_send(input: operations["app_auth.email_send"]["parameters"]["path"] & NonNullable<operations["app_auth.email_send"]["requestBody"]>["content"]["application/json"], options?: AppServerOptions): Promise<operations["app_auth.email_send"]["responses"][200]["content"]["application/json"]>;
    /** Show the emails a project's app queued this month, its workspace's total against the plan's monthly quota, and its hourly email.send limit. `GET /v1/projects/{project_id}/auth/email-usage` */
    email_usage_get(input: operations["app_auth.email_usage_get"]["parameters"]["path"]): Promise<operations["app_auth.email_usage_get"]["responses"][200]["content"]["application/json"]>;
    /** List the addresses a project's app no longer emails, after a bounce, a spam complaint or by hand. `GET /v1/projects/{project_id}/auth/email-suppressions` */
    email_suppression_list(input: operations["app_auth.email_suppression_list"]["parameters"]["path"]): Promise<operations["app_auth.email_suppression_list"]["responses"][200]["content"]["application/json"]>;
    /** Stop a project's app emailing an address: auth emails and email.send skip it. `POST /v1/projects/{project_id}/auth/email-suppressions` */
    email_suppression_add(input: operations["app_auth.email_suppression_add"]["parameters"]["path"] & NonNullable<operations["app_auth.email_suppression_add"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["app_auth.email_suppression_add"]["responses"][200]["content"]["application/json"]>;
    /** Let a project's app email a suppressed address again. `POST /v1/projects/{project_id}/auth/email-suppressions/remove` */
    email_suppression_remove(input: operations["app_auth.email_suppression_remove"]["parameters"]["path"] & NonNullable<operations["app_auth.email_suppression_remove"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["app_auth.email_suppression_remove"]["responses"][200]["content"]["application/json"]>;
    /** Show who a project's emails come from: its name beside the address every app sends from. `GET /v1/projects/{project_id}/auth/sender` */
    sender_get(input: operations["app_auth.sender_get"]["parameters"]["path"]): Promise<operations["app_auth.sender_get"]["responses"][200]["content"]["application/json"]>;
    /** Show the emails a project's app users get from Scaffold as they get them: the sign-in link, the confirmation a sign-up sends and the password reset, each with its subject, HTML and text, a sample code and a link that works nowhere. Also who they come from, and your verified address, where app_auth.email_test_send sends. `GET /v1/projects/{project_id}/auth/email-previews` */
    email_preview_list(input: operations["app_auth.email_preview_list"]["parameters"]["path"]): Promise<operations["app_auth.email_preview_list"]["responses"][200]["content"]["application/json"]>;
    /** Send yourself one of a project's auth emails as its users get it, its subject marked Test, to your own verified address and never another. Its link and code work nowhere. Each address gets at most 10 tests a day. `POST /v1/projects/{project_id}/auth/email-tests` */
    email_test_send(input: operations["app_auth.email_test_send"]["parameters"]["path"] & NonNullable<operations["app_auth.email_test_send"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["app_auth.email_test_send"]["responses"][200]["content"]["application/json"]>;
    /** Sign an app user in with the link token or code of a confirmation or magic link email, confirming their address. Each proof works once. Only the confirmation email a sign-up sent keeps the password it chose; any other email confirming the address drops it. Five wrong codes in a row for an address, across its emails, lock its codes and password for 15 minutes; the link still works. `POST /v1/projects/{project_id}/auth/verify` */
    verify(input: operations["app_auth.verify"]["parameters"]["path"] & NonNullable<operations["app_auth.verify"]["requestBody"]>["content"]["application/json"], options?: AppServerOptions): Promise<operations["app_auth.verify"]["responses"][200]["content"]["application/json"]>;
    /** Set a new password with the link token or code of a recovery email. Every session of the user ends and a new one starts. Wrong codes lock as for app_auth.verify. `POST /v1/projects/{project_id}/auth/password-reset` */
    password_reset(input: operations["app_auth.password_reset"]["parameters"]["path"] & NonNullable<operations["app_auth.password_reset"]["requestBody"]>["content"]["application/json"], options?: AppServerOptions): Promise<operations["app_auth.password_reset"]["responses"][200]["content"]["application/json"]>;
  };
  email: {
    /** Email one person from a project's app, like a receipt or a reminder, with the project's name as the sender. It counts against the workspace's monthly quota and the project's 100 an hour. `POST /v1/projects/{project_id}/email` */
    send(input: operations["email.send"]["parameters"]["path"] & NonNullable<operations["email.send"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["email.send"]["responses"][200]["content"]["application/json"]>;
  };
  app_payments: {
    /** Link a project's app to a Stripe account its customer owns and answer its setup page. Rerun for a new page. `POST /v1/projects/{project_id}/payments/connect` */
    connect_start(input: operations["app_payments.connect_start"]["parameters"]["path"] & NonNullable<operations["app_payments.connect_start"]["requestBody"]>["content"]["application/json"]): Promise<operations["app_payments.connect_start"]["responses"][200]["content"]["application/json"]>;
    /** Show if a project's Stripe account can charge and pay out, and what Stripe needs. `GET /v1/projects/{project_id}/payments/account` */
    account_get(input: operations["app_payments.account_get"]["parameters"]["path"]): Promise<operations["app_payments.account_get"]["responses"][200]["content"]["application/json"]>;
    /** Show what a project's Stripe account took over 30 days, per currency. `GET /v1/projects/{project_id}/payments/revenue` */
    revenue_get(input: operations["app_payments.revenue_get"]["parameters"]["path"]): Promise<operations["app_payments.revenue_get"]["responses"][200]["content"]["application/json"]>;
    /** Unlink a project's app from its Stripe account; the customer keeps it. `DELETE /v1/projects/{project_id}/payments/account` */
    disconnect(input: operations["app_payments.disconnect"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_payments.disconnect"]["responses"][200]["content"]["application/json"]>;
    /** Link to the Stripe Dashboard of a project's Stripe account. `GET /v1/projects/{project_id}/payments/dashboard` */
    dashboard_link(input: operations["app_payments.dashboard_link"]["parameters"]["path"]): Promise<operations["app_payments.dashboard_link"]["responses"][200]["content"]["application/json"]>;
    /** List the Stripe events forwarded to a project's app, with each try. `GET /v1/projects/{project_id}/payments/deliveries` */
    webhook_delivery_list(input: operations["app_payments.webhook_delivery_list"]["parameters"]["path"]): Promise<operations["app_payments.webhook_delivery_list"]["responses"][200]["content"]["application/json"]>;
    /** Forward a Stripe event to a project's app again now. `POST /v1/projects/{project_id}/payments/deliveries/{event_id}/resend` */
    webhook_delivery_resend(input: operations["app_payments.webhook_delivery_resend"]["parameters"]["path"], options?: WriteOptions): Promise<operations["app_payments.webhook_delivery_resend"]["responses"][200]["content"]["application/json"]>;
  };
  realtime: {
    /** Send JSON to a channel of a project's app, reaching each of its signed-in users subscribed to the channel now. Nothing is stored, so a later subscriber never gets it. Any signed-in user of the app can subscribe to any of its channels, so never publish one user's private data to a guessable channel; per-user private channels are not built yet. `POST /v1/projects/{project_id}/realtime/channels/{channel}/messages` */
    publish(input: operations["realtime.publish"]["parameters"]["path"] & NonNullable<operations["realtime.publish"]["requestBody"]>["content"]["application/json"]): Promise<operations["realtime.publish"]["responses"][200]["content"]["application/json"]>;
    /** List the realtime channels of a project's app that its users subscribe to now, with each one's subscriptions, its last message and when it was published, and the project's cap. Last messages are kept in memory only, while the channel has a subscriber. `GET /v1/projects/{project_id}/realtime/channels` */
    channel_list(input: operations["realtime.channel_list"]["parameters"]["path"]): Promise<operations["realtime.channel_list"]["responses"][200]["content"]["application/json"]>;
  };
  run: {
    /** Start a run of an agent. It reserves the estimate's maximum, or its first model call's cost if more, from the workspace's credits up front and refunds what it does not spend. run.quote prices it first and model.list gives the rates: tell the person the price before any run bigger than a quick edit. It runs without asking first; an owner limits spending with credit.cap_set. `POST /v1/runs` */
    create(input: NonNullable<operations["run.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["run.create"]["responses"][202]["content"]["application/json"]>;
    /** Price a run: its estimate, what run.create would hold, the credits available and which cap, limit or shortfall would refuse it. `POST /v1/runs/quote` */
    quote(input: NonNullable<operations["run.quote"]["requestBody"]>["content"]["application/json"]): Promise<operations["run.quote"]["responses"][200]["content"]["application/json"]>;
    /** List agent runs, newest first. `GET /v1/runs` */
    list(input: NonNullable<operations["run.list"]["parameters"]["query"]>): List<operations["run.list"]["responses"][200]["content"]["application/json"], operations["run.list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Read an agent run: status, steps with what each spent, credits, approvals and edits an undo keeps. `GET /v1/runs/{run_id}` */
    get(input: operations["run.get"]["parameters"]["path"]): Promise<operations["run.get"]["responses"][200]["content"]["application/json"]>;
    /** Stop a running or waiting run. Its edits stay until run.undo. `POST /v1/runs/{run_id}/stop` */
    stop(input: operations["run.stop"]["parameters"]["path"], options?: WriteOptions): Promise<operations["run.stop"]["responses"][200]["content"]["application/json"]>;
    /** List the changes waiting for your approval: your runs', and every member's for a workspace owner. A person approves in the console; run.deny stops the run instead. `GET /v1/workspaces/{workspace_id}/approvals` */
    approval_list(input: operations["run.approval_list"]["parameters"]["path"]): Promise<operations["run.approval_list"]["responses"][200]["content"]["application/json"]>;
    /** Deny the change a run waits on and stop the run. `POST /v1/runs/{run_id}/deny` */
    deny(input: operations["run.deny"]["parameters"]["path"] & NonNullable<operations["run.deny"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["run.deny"]["responses"][202]["content"]["application/json"]>;
    /** Resume a run stopped by a person, a limit or its credits. `POST /v1/runs/{run_id}/resume` */
    resume(input: operations["run.resume"]["parameters"]["path"] & NonNullable<operations["run.resume"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["run.resume"]["responses"][202]["content"]["application/json"]>;
    /** Ask a done or denied run more; its agent goes on in the same run. `POST /v1/runs/{run_id}/follow-up` */
    follow_up(input: operations["run.follow_up"]["parameters"]["path"] & NonNullable<operations["run.follow_up"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["run.follow_up"]["responses"][202]["content"]["application/json"]>;
    /** Take back every edit of an ended run as one change. Refused while run.get lists later edits, unless keep_changed. `POST /v1/runs/{run_id}/undo` */
    undo(input: operations["run.undo"]["parameters"]["path"] & NonNullable<operations["run.undo"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["run.undo"]["responses"][200]["content"]["application/json"]>;
  };
  agent: {
    /** List a workspace's agents, their settings and whether each is paused or working. Which models agents may use and what they cost is model.list's answer. `GET /v1/workspaces/{workspace_id}/agents` */
    list(input: operations["agent.list"]["parameters"]["path"]): Promise<operations["agent.list"]["responses"][200]["content"]["application/json"]>;
    /** Read an agent: what it does, may do and asks before doing, and its settings. `GET /v1/agents/{agent_id}` */
    get(input: operations["agent.get"]["parameters"]["path"]): Promise<operations["agent.get"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: change what an agent asks before doing, its default model or its monthly limit in millicredits. `PATCH /v1/agents/{agent_id}` */
    update(input: operations["agent.update"]["parameters"]["path"] & NonNullable<operations["agent.update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["agent.update"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: pause an agent. It starts no runs and skips its schedules; runs going now finish. `POST /v1/agents/{agent_id}/pause` */
    pause(input: operations["agent.pause"]["parameters"]["path"], options?: WriteOptions): Promise<operations["agent.pause"]["responses"][200]["content"]["application/json"]>;
    /** Owners only: resume a paused agent. A stopped run resumes by run.resume. `POST /v1/agents/{agent_id}/resume` */
    resume(input: operations["agent.resume"]["parameters"]["path"], options?: WriteOptions): Promise<operations["agent.resume"]["responses"][200]["content"]["application/json"]>;
  };
  schedule: {
    /** List a workspace's schedules, oldest first, with when each runs next. `GET /v1/workspaces/{workspace_id}/schedules` */
    list(input: operations["schedule.list"]["parameters"]["path"]): Promise<operations["schedule.list"]["responses"][200]["content"]["application/json"]>;
    /** Paid plan: run an agent on a repeating time, as you. A run it cannot start, as while the agent is paused, is skipped. `POST /v1/workspaces/{workspace_id}/schedules` */
    create(input: operations["schedule.create"]["parameters"]["path"] & NonNullable<operations["schedule.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["schedule.create"]["responses"][200]["content"]["application/json"]>;
    /** Change a schedule. Only its maker and owners may, and only its maker its prompt or agent, as it runs as them. `PATCH /v1/schedules/{schedule_id}` */
    update(input: operations["schedule.update"]["parameters"]["path"] & NonNullable<operations["schedule.update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["schedule.update"]["responses"][200]["content"]["application/json"]>;
    /** Delete a schedule. Only its maker and owners may. `DELETE /v1/schedules/{schedule_id}` */
    delete(input: operations["schedule.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["schedule.delete"]["responses"][200]["content"]["application/json"]>;
    /** Bring back a deleted schedule. `POST /v1/schedules/{schedule_id}/restore` */
    restore(input: operations["schedule.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["schedule.restore"]["responses"][200]["content"]["application/json"]>;
    /** Start a run of a schedule now, as you, without moving its next run. `POST /v1/schedules/{schedule_id}/run` */
    run_now(input: operations["schedule.run_now"]["parameters"]["path"], options?: WriteOptions): Promise<operations["schedule.run_now"]["responses"][202]["content"]["application/json"]>;
  };
  onboarding: {
    /** Show your setup checklist in a workspace, what ticked each step and what onboarding.starter_create made there. `GET /v1/workspaces/{workspace_id}/onboarding` */
    get(input: operations["onboarding.get"]["parameters"]["path"]): Promise<operations["onboarding.get"]["responses"][200]["content"]["application/json"]>;
    /** Put off a setup step that is not done. It still ticks if it happens. `POST /v1/workspaces/{workspace_id}/onboarding/{step}/skip` */
    step_skip(input: operations["onboarding.step_skip"]["parameters"]["path"], options?: WriteOptions): Promise<operations["onboarding.step_skip"]["responses"][200]["content"]["application/json"]>;
    /** Bring back a skipped setup step. `POST /v1/workspaces/{workspace_id}/onboarding/{step}/resume` */
    step_resume(input: operations["onboarding.step_resume"]["parameters"]["path"], options?: WriteOptions): Promise<operations["onboarding.step_resume"]["responses"][200]["content"]["application/json"]>;
    /** The console's first run: fill a workspace once with a Static site project, five starter tasks and a Launch plan page holding the person's answer to What are you building, or a generic set without one. The project is one of the 2 a Free workspace holds. Deploys nothing. Called again, it answers what is there and makes nothing. `POST /v1/workspaces/{workspace_id}/onboarding/starter` */
    starter_create(input: operations["onboarding.starter_create"]["parameters"]["path"] & NonNullable<operations["onboarding.starter_create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["onboarding.starter_create"]["responses"][200]["content"]["application/json"]>;
    /** Remove what onboarding.starter_create made that nobody changed since: untouched tasks and page are archived and a project never deployed or added to is deleted, each restorable as usual. Changed parts stay, so the workspace can be filled again. `DELETE /v1/workspaces/{workspace_id}/onboarding/starter` */
    starter_remove(input: operations["onboarding.starter_remove"]["parameters"]["path"], options?: WriteOptions): Promise<operations["onboarding.starter_remove"]["responses"][200]["content"]["application/json"]>;
  };
  notification: {
    /** List your notifications in a workspace, newest first, by unread or source. `GET /v1/workspaces/{workspace_id}/notifications` */
    list(input: operations["notification.list"]["parameters"]["path"] & NonNullable<operations["notification.list"]["parameters"]["query"]>): List<operations["notification.list"]["responses"][200]["content"]["application/json"], operations["notification.list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Mark your notifications read, answering those it changed. `POST /v1/workspaces/{workspace_id}/notifications/read` */
    read(input: operations["notification.read"]["parameters"]["path"] & NonNullable<operations["notification.read"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["notification.read"]["responses"][200]["content"]["application/json"]>;
    /** Mark your notifications unread, answering those it changed. `POST /v1/workspaces/{workspace_id}/notifications/unread` */
    unread(input: operations["notification.unread"]["parameters"]["path"] & NonNullable<operations["notification.unread"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["notification.unread"]["responses"][200]["content"]["application/json"]>;
    /** Mark up to 1000 unread notifications read, newest first, answering them. `POST /v1/workspaces/{workspace_id}/notifications/read-all` */
    read_all(input: operations["notification.read_all"]["parameters"]["path"], options?: WriteOptions): Promise<operations["notification.read_all"]["responses"][200]["content"]["application/json"]>;
    /** Count your unread notifications, in all and per source. `GET /v1/workspaces/{workspace_id}/notifications/unread-count` */
    unread_count(input: operations["notification.unread_count"]["parameters"]["path"]): Promise<operations["notification.unread_count"]["responses"][200]["content"]["application/json"]>;
    /** Show how each source reaches you: in app, and by email at 18:00 UTC. `GET /v1/workspaces/{workspace_id}/notifications/preferences` */
    preferences_get(input: operations["notification.preferences_get"]["parameters"]["path"]): Promise<operations["notification.preferences_get"]["responses"][200]["content"]["application/json"]>;
    /** Set whether a source reaches you in app and by email. `POST /v1/workspaces/{workspace_id}/notifications/preferences` */
    preferences_set(input: operations["notification.preferences_set"]["parameters"]["path"] & NonNullable<operations["notification.preferences_set"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["notification.preferences_set"]["responses"][200]["content"]["application/json"]>;
  };
  search: {
    /** Find tasks, records, pages and runs by words or a record key, with counts per kind. `GET /v1/workspaces/{workspace_id}/search` */
    query(input: operations["search.query"]["parameters"]["path"] & NonNullable<operations["search.query"]["parameters"]["query"]>): Promise<operations["search.query"]["responses"][200]["content"]["application/json"]>;
  };
  comment: {
    /** Comment on a record. `POST /v1/records/{record_id}/comments` */
    create(input: operations["comment.create"]["parameters"]["path"] & NonNullable<operations["comment.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["comment.create"]["responses"][200]["content"]["application/json"]>;
    /** List a record's comments, oldest first. `GET /v1/records/{record_id}/comments` */
    list(input: operations["comment.list"]["parameters"]["path"] & NonNullable<operations["comment.list"]["parameters"]["query"]>): List<operations["comment.list"]["responses"][200]["content"]["application/json"], operations["comment.list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Delete your comment. `DELETE /v1/comments/{comment_id}` */
    delete(input: operations["comment.delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["comment.delete"]["responses"][200]["content"]["application/json"]>;
    /** Bring back your deleted comment. `POST /v1/comments/{comment_id}/restore` */
    restore(input: operations["comment.restore"]["parameters"]["path"], options?: WriteOptions): Promise<operations["comment.restore"]["responses"][200]["content"]["application/json"]>;
  };
  status: {
    /** Show Scaffold's status overall and per component, open incidents, planned maintenance and console notices. Needs no sign-in. `GET /v1/status` */
    get(input?: Record<string, never>): Promise<operations["status.get"]["responses"][200]["content"]["application/json"]>;
    /** Show which build of Scaffold answers: its git commit and when it was built. Needs no sign-in. `GET /v1/version` */
    version_get(input?: Record<string, never>): Promise<operations["status.version_get"]["responses"][200]["content"]["application/json"]>;
    /** List incidents and maintenance open in the last 90 days, newest first, with updates. Needs no sign-in. `GET /v1/status/incidents` */
    incident_list(input?: NonNullable<operations["status.incident_list"]["parameters"]["query"]>): Promise<operations["status.incident_list"]["responses"][200]["content"]["application/json"]>;
    /** Show one incident or maintenance window with every update and any write-up. Needs no sign-in. `GET /v1/status/incidents/{incident_id}` */
    incident_get(input: operations["status.incident_get"]["parameters"]["path"]): Promise<operations["status.incident_get"]["responses"][200]["content"]["application/json"]>;
  };
  deploy: {
    /** Build a project's upload in isolation, a Node app or a static site, and put it live once it serves. It needs only the sha256 source.upload or source.upload_files answered, or none for the newest upload. It answers the deploy queued, since a build takes minutes: say so, check deploy.get when the person asks rather than in a loop, and call its URL live only once deploy.get says live. The live deploy stays ready for deploy.rollback. A Node app needs the Paid plan and takes the env as it is now, plus DATABASE_URL; an optional release command runs first, after a dump of the database. Any earlier deploy of the project that is not live yet fails, so this one replaces it. package.json "scaffold": {"kind": "worker"} makes a worker: no web page, never sleeps, Paid only. `POST /v1/projects/{project_id}/deploys` */
    create(input: operations["deploy.create"]["parameters"]["path"] & NonNullable<operations["deploy.create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["deploy.create"]["responses"][200]["content"]["application/json"]>;
    /** List a project's deploys, newest first. `GET /v1/projects/{project_id}/deploys` */
    list(input: operations["deploy.list"]["parameters"]["path"]): Promise<operations["deploy.list"]["responses"][200]["content"]["application/json"]>;
    /** List the newest deploy of each project in a workspace, newest first, with its status, so one read shows where every project stands. `GET /v1/workspaces/{workspace_id}/deploys` */
    recent_list(input: operations["deploy.recent_list"]["parameters"]["path"]): Promise<operations["deploy.recent_list"]["responses"][200]["content"]["application/json"]>;
    /** Show a deploy and its status: queued, building, starting, live, superseded, rolled_back or failed with its reason. `GET /v1/deploys/{deploy_id}` */
    get(input: operations["deploy.get"]["parameters"]["path"]): Promise<operations["deploy.get"]["responses"][200]["content"]["application/json"]>;
    /** Undo a deploy.create: put an earlier deploy of the project back live, without a rebuild, and its database too with restore_database, which only an owner on the Paid plan may ask. A static site goes back on any plan, a Node app needs the Paid plan. The deploy it replaces can be rolled back to in turn, and a deploy not yet live fails. While the database is put back, the project's address shows the maintenance page. `POST /v1/deploys/{deploy_id}/rollback` */
    rollback(input: operations["deploy.rollback"]["parameters"]["path"] & NonNullable<operations["deploy.rollback"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["deploy.rollback"]["responses"][200]["content"]["application/json"]>;
    /** Read a deploy's log a page at a time: its app's output, each line with its time, the first page holding the newest lines, or its build steps. range keeps the last 15m, 1h, 24h or 7d; pass next as after to read on. Over HTTP, follow it as a stream to get each new page as the log grows. `GET /v1/deploys/{deploy_id}/logs` */
    logs(input: operations["deploy.logs"]["parameters"]["path"] & NonNullable<operations["deploy.logs"]["parameters"]["query"]>): Promise<operations["deploy.logs"]["responses"][200]["content"]["application/json"]>;
  };
  domain: {
    /** Add a custom domain to a project's app. A Free workspace has 1 custom domain; more need the Paid plan. It waits for the DNS records it answers: a CNAME to Scaffold, or an A record at the apex, and a TXT record proving it is yours. Other projects' claims never block it, verified ones included: the project whose records verify the domain takes it from the rest, and a claim that never verifies expires after 7 days. `POST /v1/projects/{project_id}/domains` */
    add(input: operations["domain.add"]["parameters"]["path"] & NonNullable<operations["domain.add"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["domain.add"]["responses"][200]["content"]["application/json"]>;
    /** List a project's custom domains, oldest first, with where each stands, the DNS records it needs and when its certificate renews. `GET /v1/projects/{project_id}/domains` */
    list(input: operations["domain.list"]["parameters"]["path"]): Promise<operations["domain.list"]["responses"][200]["content"]["application/json"]>;
    /** Check a custom domain's DNS now. Once it points at Scaffold with its TXT record it is verified: it serves the project's live deploy and gets its certificate on its first visit, other projects' unverified claims on it are removed, and one that held it verified goes back to waiting. A wrong or missing record is named with its fix. Scaffold rechecks verified domains daily: one whose records are gone 3 days goes back to waiting and stops serving. A verified domain whose records point away from Scaffold is marked so, with the problem found, and gets no new certificate until a check finds them pointing back. `POST /v1/domains/{domain_id}/check` */
    check(input: operations["domain.check"]["parameters"]["path"], options?: WriteOptions): Promise<operations["domain.check"]["responses"][200]["content"]["application/json"]>;
    /** Remove a custom domain from its project. The app stops answering there at once, its certificate is deleted within a day and never renewed, and any project can add it again with domain.add. Adding it back waits for its DNS check and a new certificate, so the address stays down until then: tell the person before removing a domain that serves. `DELETE /v1/domains/{domain_id}` */
    remove(input: operations["domain.remove"]["parameters"]["path"], options?: WriteOptions): Promise<operations["domain.remove"]["responses"][200]["content"]["application/json"]>;
  };
  webhook: {
    /** Register an https endpoint for a project's deploy and app user events. Each is POSTed signed, under an event id to dedupe by. The signing secret is shown once. `POST /v1/projects/{project_id}/webhooks` */
    endpoint_create(input: operations["webhook.endpoint_create"]["parameters"]["path"] & NonNullable<operations["webhook.endpoint_create"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["webhook.endpoint_create"]["responses"][200]["content"]["application/json"]>;
    /** List a project's webhook endpoints, oldest first, without secrets. `GET /v1/projects/{project_id}/webhooks` */
    endpoint_list(input: operations["webhook.endpoint_list"]["parameters"]["path"]): Promise<operations["webhook.endpoint_list"]["responses"][200]["content"]["application/json"]>;
    /** Change a webhook endpoint's URL or event types, or turn it off or on again. It keeps its signing secret. `PATCH /v1/webhooks/{endpoint_id}` */
    endpoint_update(input: operations["webhook.endpoint_update"]["parameters"]["path"] & NonNullable<operations["webhook.endpoint_update"]["requestBody"]>["content"]["application/json"], options?: WriteOptions): Promise<operations["webhook.endpoint_update"]["responses"][200]["content"]["application/json"]>;
    /** Delete a webhook endpoint with its signing secret and delivery log. Nothing more is posted to it. `DELETE /v1/webhooks/{endpoint_id}` */
    endpoint_delete(input: operations["webhook.endpoint_delete"]["parameters"]["path"], options?: WriteOptions): Promise<operations["webhook.endpoint_delete"]["responses"][200]["content"]["application/json"]>;
    /** List a project's webhook deliveries of the last 30 days, newest first, with each try and what the endpoint answered. `GET /v1/projects/{project_id}/webhook-deliveries` */
    delivery_list(input: operations["webhook.delivery_list"]["parameters"]["path"] & NonNullable<operations["webhook.delivery_list"]["parameters"]["query"]>): List<operations["webhook.delivery_list"]["responses"][200]["content"]["application/json"], operations["webhook.delivery_list"]["responses"][200]["content"]["application/json"]["data"][number]>;
    /** Try a webhook delivery that has not succeeded again now, with the same event id and body. `POST /v1/webhook-deliveries/{delivery_id}/resend` */
    delivery_resend(input: operations["webhook.delivery_resend"]["parameters"]["path"], options?: WriteOptions): Promise<operations["webhook.delivery_resend"]["responses"][200]["content"]["application/json"]>;
    /** Try every delivery to a webhook endpoint that failed for good again now, with the same event ids and bodies. Those tried 26 times are left. `POST /v1/webhooks/{endpoint_id}/resend-failed` */
    endpoint_resend_failed(input: operations["webhook.endpoint_resend_failed"]["parameters"]["path"], options?: WriteOptions): Promise<operations["webhook.endpoint_resend_failed"]["responses"][200]["content"]["application/json"]>;
    /** Post a signed ping event to a webhook endpoint now, also one that is off, and log it as a delivery with what the endpoint answered. It is not retried. `POST /v1/webhooks/{endpoint_id}/test` */
    endpoint_test(input: operations["webhook.endpoint_test"]["parameters"]["path"], options?: WriteOptions): Promise<operations["webhook.endpoint_test"]["responses"][200]["content"]["application/json"]>;
    /** Replace a webhook endpoint's signing secret, shown once. Every POST from now on is signed with the new one, retries of earlier events too. `POST /v1/webhooks/{endpoint_id}/secret` */
    endpoint_secret_rotate(input: operations["webhook.endpoint_secret_rotate"]["parameters"]["path"], options?: WriteOptions): Promise<operations["webhook.endpoint_secret_rotate"]["responses"][200]["content"]["application/json"]>;
  };
}
