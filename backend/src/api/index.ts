import express from 'express';
<<<<<<< HEAD
import logger from '../utils/logger';
import calRouter from "./routes/calendar";
=======

import logger from '../utils/logger';
>>>>>>> 0f31272 (frontend logic)

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
  logger.http('200 GET / (api)');
});

<<<<<<< HEAD
router.use('/calendar', calRouter);

=======
>>>>>>> 0f31272 (frontend logic)
export default router;
