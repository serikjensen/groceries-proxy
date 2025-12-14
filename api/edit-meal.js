export default async function handler(req, res) {
  if (req.method !== "PATCH")
    return res.status(405).json({ error: "Only PATCH allowed" });

  try {
    const { id, updates } = req.body;
    if (!id || !updates)
      return res
        .status(400)
        .json({ error: "Both 'id' and 'updates' are required" });

    // 🔧 Build correct Firebase path
    const base = process.env.FIREBASE_URL.replace(/\/?\.json$/, "");
    const firebaseUrl = `${base}/meals/${id}.json`;

    const r = await fetch(firebaseUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!r.ok) {
      const text = await r.text();
      throw new Error(`Firebase responded with ${r.status}: ${text}`);
    }

    const result = await r.json();
    res.status(200).json({ success: true, updated: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
