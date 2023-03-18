import express from 'express';
import fetchCities from '../helpers/getMjhCities';

const router = express.Router();

router.get('/cities', async (_req, res) => {
  try {
    fetchCities().then(cities => {
        res.json(cities);
    })
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
});

export default router;