export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Missing data" });

    const firebaseUrl = process.env.FIREBASE_URL;
    const r = await fetch(firebaseUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await r.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
