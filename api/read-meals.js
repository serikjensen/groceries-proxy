export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  try {
    // Ensure no double slashes and include .json
    const base = process.env.FIREBASE_URL?.replace(/\/$/, "");
    const firebaseUrl = `${base}/meals.json`;

    const r = await fetch(firebaseUrl);

    if (!r.ok) {
      const text = await r.text();
      return res
        .status(r.status)
        .json({ error: `Firebase responded with ${r.status}: ${text}` });
    }

    const data = await r.json();
    res.status(200).json({ meals: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
