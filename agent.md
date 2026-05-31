# Agent Rules

## Environment Variables and Secrets
1. **Never hardcode secrets or fixed configuration values** (such as emails, external URLs, port numbers, connection strings, API keys) in the source code.
2. Always store secrets and environment-specific variables in `.env` or `.env.local`.
3. Whenever a new environment variable is added to the project, **you MUST immediately update the `src/env.md` template** with the new key so that the environment template stays perfectly in sync with the required configuration.
4. Use `process.env.VARIABLE_NAME` throughout the codebase, and provide sensible fallbacks only when the value is not a security risk (e.g. `process.env.PORT || 3000`).
