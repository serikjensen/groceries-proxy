export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { entry } = req.body;
    if (!entry || !entry.date || !entry.meals)
      return res.status(400).json({
        error: "Missing 'entry.date' or 'entry.meals' in request body",
      });

    const base = process.env.FIREBASE_URL.replace(/\/?\.json$/, "");
    const firebaseUrl = `${base}/mealHistory/${entry.date}.json`;

    const r = await fetch(firebaseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
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
