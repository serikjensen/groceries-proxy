export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  try {
    const firebaseUrl = process.env.FIREBASE_URL.replace(".json", "/storeLayout.json");
    const r = await fetch(firebaseUrl);
    const data = await r.json();

    // Sort layout by order ascending
    const layout = Array.isArray(data)
      ? data.sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];

    res.status(200).json({ layout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
