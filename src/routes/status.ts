import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    "up": true,
    "version": process.env.npm_package_version
  });
});

export default router;