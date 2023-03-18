import express from "express";
import { getEpg } from "../controllers/epg";

const router = express.Router();

router.get("/:city", async (req, res) => {
    if (req.params.city) {
        try {
            const epg = await getEpg(req.params.city);
            res.setHeader("Content-Type", "application/xml");
            res.send(epg);
        } catch (e) {
            console.error(e);
            res.status(500).send("Internal server error");
        }
    } else {
        res.status(400).send("Please provide a city name");
    }
});

export default router;