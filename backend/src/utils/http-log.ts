import morgan, { StreamOptions } from 'morgan';

import logger from './logger';

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: message => logger.http(message.split('\n')[0]),
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || 'dev';
  return env !== 'dev';
};

// Build the morgan middleware
const httpLog = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ':method :url :status length: :res[content-length] time: :response-time ms',
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream, skip },
);

export default httpLog;
