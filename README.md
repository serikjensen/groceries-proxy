# Groceries Proxy

This project exposes serverless API routes that proxy requests to Firebase.  
Two environment variables are required for every route:

- `FIREBASE_URL` – The base Realtime Database URL ending in `.json`
- `FIREBASE_SERVICE_ACCOUNT_JSON` – A service account JSON (stringified or base64) used to mint short-lived OAuth access tokens

## Local development

Create an `.env.local` file (Next.js automatically loads it) with both variables:

```env
FIREBASE_URL=https://your-project.firebaseio.com/.json
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

If your provider has trouble with multiline JSON, base64-encode the JSON and set
`FIREBASE_SERVICE_ACCOUNT_JSON` to the base64 string.

Restart the dev server after changing env vars so that the API routes pick up the new values.

## Configuring Vercel

1. In the Vercel dashboard, open your project and go to **Settings → Environment Variables**.  
2. Add `FIREBASE_URL` and `FIREBASE_AUTH_TOKEN` for each environment (Production / Preview / Development).  
3. Trigger a redeploy so the new secrets are injected into the serverless functions.

You can also set them via the CLI:

```bash
vercel env add FIREBASE_URL production
vercel env add FIREBASE_AUTH_TOKEN production
```

Be sure the auth token you supply stays in sync with Firebase; rotating the token just requires updating the Vercel env var and redeploying.
