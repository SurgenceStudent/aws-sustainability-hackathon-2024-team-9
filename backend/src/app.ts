import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import logger from './utils/logger';

import './utils/loadEnv';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  logger.http('200 GET /');
  res.json({
    message:
      'Welcome to the TouchGrass backend!',
  });
});

app.use('/api', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
