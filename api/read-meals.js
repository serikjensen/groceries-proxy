export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  try {
    const firebaseUrl = process.env.FIREBASE_URL.replace(".json", "/meals.json");
    const r = await fetch(firebaseUrl);
    const data = await r.json();

    // Convert keyed object → array
    const meals = data
      ? Object.values(data).map((meal, i) => ({
          ...meal,
          id: meal.id || Object.keys(data)[i], // fallback if missing
        }))
      : [];

    res.status(200).json({ meals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
