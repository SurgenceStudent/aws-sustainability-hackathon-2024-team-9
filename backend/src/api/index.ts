import express from 'express';
import logger from '../utils/logger';
import calRouter from "./routes/calendar";

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
  logger.http('200 GET / (api)');
});

router.use('/calendar', calRouter);

export default router;
