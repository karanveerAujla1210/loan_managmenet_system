# Sync Algorithm & Conflict Resolution

## Sync Algorithm Overview

### 1. Queue-Based Synchronization
- All offline actions (payments, PTPs, notes) are queued locally with unique `clientRef`
- Sync processes queue items in FIFO order with configurable concurrency (max 3 concurrent)
- Each item includes retry count and exponential backoff for failed attempts

### 2. Idempotency Strategy
- Every local action generates a UUID `clientRef` sent to backend
- Backend must honor idempotency - duplicate `clientRef` returns existing record
- Local records track sync status: `queued` → `synced` → `failed`

### 3. Retry Logic
- **Retryable errors:** Network failures, 5xx server errors, 429 rate limiting
- **Non-retryable errors:** 4xx client errors (except 429)
- **Max retries:** 5 attempts with exponential backoff (1s, 2s, 4s, 8s, 16s)
- **Failed items:** Marked for manual resolution in Sync Status screen

### 4. Background Synchronization
- Automatic sync triggers: App foreground, network reconnection, periodic background fetch
- Background fetch interval: 15 minutes (configurable)
- Sync runs silently without blocking UI operations

### 5. Data Reconciliation
- **Payment responses:** Server returns updated loan state and payment allocation
- **Local updates:** Outstanding amounts and schedule status updated from server response
- **Conflict resolution:** Server is always source of truth for financial data

### 6. Offline-First Design
- All user actions work immediately offline
- Local SQLite provides immediate feedback
- Network sync happens asynchronously in background
- UI shows sync status indicators (queued/synced/failed badges)

## Conflict Resolution Policy

### Financial Data (Payments)
- **Policy:** Server wins - local data reconciled with server response
- **Process:** Payment amount sent to server → server calculates allocation → local schedule updated
- **Conflicts:** Overpayments/underpayments handled by server allocation logic

### Non-Financial Data (Notes, PTPs)
- **Policy:** Last-write-wins based on server timestamps
- **Process:** Local changes queued → server processes in order → conflicts resolved by timestamp
- **Duplicates:** Prevented by clientRef idempotency

### Loan Assignment Changes
- **Policy:** Server assignment takes precedence
- **Process:** Periodic sync fetches latest assignments → local queue filtered by current agent
- **Conflicts:** Orphaned queue items marked as failed for manual review

## Error Handling Scenarios

### Network Partitions
- All actions continue offline
- Queue accumulates pending items
- Automatic retry when network restored
- No data loss - everything persisted locally

### Clock Skew
- Local timestamps used for ordering only
- Server timestamps used for conflict resolution
- Sync process handles time zone differences

### Large Queue Backlogs
- Batch processing with concurrency limits
- Progress indicators in Sync Status screen
- Option to clear completed items to reduce storage

### Partial Sync Failures
- Individual item failures don't block queue processing
- Failed items remain in queue for manual retry
- Success/failure status tracked per item

## Data Pruning Strategy

### Automatic Cleanup
- Completed sync items older than 30 days auto-deleted
- Failed items retained indefinitely for manual resolution
- Configurable retention policy in app settings

### Manual Cleanup
- "Clear Completed" button in Sync Status screen
- Export failed items for debugging
- Reset sync queue option (emergency use)