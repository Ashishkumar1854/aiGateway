# Deprecated n8n Workflows

This directory contains workflows that are no longer used by the active Smart Apply services but are preserved for rollback capabilities and architecture history.

## Preserved Workflows

### 1. `generate_email.json`
- **Status**: Deprecated / Inactive.
- **Migration Details**: AI Email Generation logic has been migrated into the backend service [email-generator.service.js](file:///Users/AiGateway/backend/src/api/v1/smart-apply/services/email-generator.service.js) powered directly by `gemini-2.0-flash`.
- **Reason for Deprecation**: 
  - **Decoupled Performance**: Prevents n8n webhook network latencies and failure dependencies during initial draft creation.
  - **Single Background Pipeline**: Integrates directly with the matching pipeline (`match-engine.service.js`) asynchronously to perform structured matching before generating deep personalizations.
  - **Robust Fallbacks**: Leverages backend-native 429 quota exhaustion checks and local heuristic fallback email generation for 100% service uptime.
