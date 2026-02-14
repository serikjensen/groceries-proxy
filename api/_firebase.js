import { GoogleAuth } from "google-auth-library";

const ACCESS_SCOPES = [
  "https://www.googleapis.com/auth/firebase.database",
  "https://www.googleapis.com/auth/userinfo.email",
];

let cachedToken = null;
let cachedExpiry = 0;

function parseServiceAccountJson(rawValue) {
  if (!rawValue) return null;
  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const decoded = Buffer.from(trimmed, "base64").toString("utf8").trim();
  if (!decoded.startsWith("{")) {
    throw new Error("Service account JSON env var is not valid JSON or base64");
  }
  return JSON.parse(decoded);
}

async function getFirebaseAuthToken() {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccount = parseServiceAccountJson(rawServiceAccount);
  if (!serviceAccount) {
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable"
    );
  }

  const now = Date.now();
  if (cachedToken && cachedExpiry && now < cachedExpiry - 60_000) {
    return cachedToken;
  }

  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ACCESS_SCOPES,
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error("Failed to obtain Firebase access token");

  const credentials = await client.getCredentials();
  cachedToken = token;
  cachedExpiry = credentials.expiry_date || now + 50 * 60 * 1000;

  return token;
}

export async function buildFirebaseUrl(path = "") {
  const baseUrl = process.env.FIREBASE_URL;
  if (!baseUrl)
    throw new Error("Missing FIREBASE_URL environment variable");

  const authToken = await getFirebaseAuthToken();

  const trimmedBase = baseUrl.replace(/\/?\.json$/, "");
  const normalizedPath = path.replace(/^\//, "");
  let url = normalizedPath ? `${trimmedBase}/${normalizedPath}` : trimmedBase;

  if (!url.endsWith(".json")) url = `${url}.json`;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}access_token=${encodeURIComponent(authToken)}`;
}
