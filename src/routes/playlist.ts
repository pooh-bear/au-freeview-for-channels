import express from 'express';
import fetchCities from '../helpers/getMjhCities';

import { getPlaylist } from '../controllers/playlist';

const router = express.Router();

router.get('/:city', async (req, res) => {
    if (req.params.city) {
        if ((await fetchCities()).includes(req.params.city)) {
            try {
                const protocol = req.protocol;
                const host = req.get('host');
                const baseUrl = `${protocol}://${host}`;
                const playlist = await getPlaylist(req.params.city, baseUrl);
                res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                res.send(playlist);
            } catch (e) {
                console.error(e);
                res.status(500).send('Internal server error');
            }
        } else res.status(404).send('City not found');
    } else {
        res.status(400).send('Please provide a city name');
    }
})

export default router;