import express from 'express';
import logger from '../utils/logger';
import calRouter from "./routes/calendar";
import navRouter from "./routes/navigate";

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
  logger.http('200 GET / (api)');
});

router.use('/calendar', calRouter);
router.use('/navigate', navRouter);

export default router;
