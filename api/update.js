export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Missing 'data' in request body" });
    }

    const firebaseUrl = process.env.FIREBASE_URL;
    if (!firebaseUrl) {
      return res.status(500).json({ error: "Missing FIREBASE_URL environment variable" });
    }

    const response = await fetch(firebaseUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Firebase responded with ${response.status}: ${text}`);
    }

    const result = await response.json();
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
