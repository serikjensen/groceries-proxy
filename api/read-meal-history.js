import { buildFirebaseUrl } from "./_firebase.js";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  try {
    const firebaseUrl = await buildFirebaseUrl("mealHistory");
    const r = await fetch(firebaseUrl);
    const data = await r.json();

    // Return as array sorted by most recent
    const history = data
      ? Object.values(data).sort((a, b) =>
          (b.date || "").localeCompare(a.date || "")
        )
      : [];

    res.status(200).json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
