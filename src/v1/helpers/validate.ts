import * as express from 'express';
import { validateToken } from './jwt';

/**
 *
 * @param req express.Request
 * @returns boolean
 */
export const validateRequest = (req: express.Request) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];
    return validateToken(token);
  } catch (e) {
    return false;
  }
};
