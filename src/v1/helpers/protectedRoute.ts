import * as express from 'express';
import { RESPONSE_CODES } from '../constants';
import { validateToken } from './jwt';
/**
 *
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * @returns true or json
 */
export const protectedRoute = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];
    if (!validateToken(token)) {
      throw new Error('token not valid');
    }
    next();
  } catch (e) {
    return res.json(RESPONSE_CODES[401]);
  }
};
