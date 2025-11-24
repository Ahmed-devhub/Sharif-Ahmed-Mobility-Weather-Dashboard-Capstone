import express from "express";
import SearchHistory from "../models/SearchHistory.js";

const router = express.Router();


router.post("/search-history", async (req, res) => {
    await SearchHistory.create({
        userId: req.body.userId,
        borough: req.body.borough,
        zip: req.body.zip,
        searchAt: new Date
    })
    return res.json({success: "Successfully saved search information"})
});

export default router;
