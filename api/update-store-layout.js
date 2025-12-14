export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { layout } = req.body;
    if (!layout || !Array.isArray(layout))
      return res.status(400).json({ error: "Missing or invalid 'layout' array" });

    // Build Firebase URL for storeLayout node
    const base = process.env.FIREBASE_URL.replace(/\/?\.json$/, "");
    const firebaseUrl = `${base}/storeLayout.json`;

    // Replace the existing layout
    const r = await fetch(firebaseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(layout),
    });

    if (!r.ok) {
      const text = await r.text();
      throw new Error(`Firebase responded with ${r.status}: ${text}`);
    }

    const result = await r.json();
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
