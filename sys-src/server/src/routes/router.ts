import stats from './stats';
import express from 'express';
import authentication from './authentication';

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  stats(router);
  return router;
};
