import express from "express";
import axios from "axios";

const router = express.Router();


router.get("/compare", async (req, res) => {
  try {
    const { b1, b2 } = req.query;

    if (!b1 || !b2) {
      return res.json({ error: "Both b1 and b2 borough names are required." });
    }

    const boroughA = b1.replace("-", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    const boroughB = b2.replace("-", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

    const [resA, resB] = await Promise.all([
        axios.get(`https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=%27${boroughA}%27`),
        axios.get(`https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=%27${boroughB}%27`)
    ]);
    function calcAvgSpeed(data) {
      let total = 0;
      let count = 0;
      for (let row of data) {
        if (row.speed) {
          total += Number(row.speed);
          count++;
        }
      }
      return count > 0 ? Number((total / count).toFixed(2)) : 0;
    }

    const avgA = calcAvgSpeed(resA.data);
    const avgB = calcAvgSpeed(resB.data);

    return res.json({
      boroughA: { name: boroughA, avg_speed: avgA, congestion_level: resA.data.congestion_level},
      boroughB: { name: boroughB, avg_speed: avgB, congestion_level: resB.data.congestion_level},
      faster: avgA > avgB ? boroughA : boroughB,
      slower: avgA < avgB ? boroughA : boroughB
    });

  } catch (err) {
    console.log("Compare Error:", err);
    return res.json({ error: "Failed to compare boroughs." });
  }
});

export default router;
