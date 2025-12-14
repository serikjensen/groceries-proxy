export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET allowed" });

  try {
    const firebaseUrl = process.env.FIREBASE_URL + "/meals.json";
    const r = await fetch(firebaseUrl);
    const data = await r.json();

    res.status(200).json({ meals: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
