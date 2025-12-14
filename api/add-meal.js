export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { meal } = req.body;
    if (!meal) return res.status(400).json({ error: "Missing 'meal' object in request body" });

    // ✅ Align with your working handlers
    const base = process.env.FIREBASE_URL.replace(".json", "");
    const firebaseUrl = `${base}/data/meals.json`;

    const r = await fetch(firebaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meal),
    });

    if (!r.ok) {
      const text = await r.text();
      throw new Error(`Firebase responded with ${r.status}: ${text}`);
    }

    const result = await r.json();
    res.status(200).json({ success: true, name: result.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
