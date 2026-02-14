import { buildFirebaseUrl } from "./_firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { meal } = req.body;
    if (!meal || !meal.id) {
      return res
        .status(400)
        .json({ error: "Missing 'meal' object or 'meal.id' in request body" });
    }

    // build the Firebase URL for the specific meal key
    const firebaseUrl = await buildFirebaseUrl(`meals/${meal.id}`);

    const r = await fetch(firebaseUrl, {
      method: "PUT", // 🔄 replace or create at this specific key
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meal),
    });

    if (!r.ok) {
      const text = await r.text();
      throw new Error(`Firebase responded with ${r.status}: ${text}`);
    }

    const result = await r.json();
    res.status(200).json({ success: true, id: meal.id, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
