import * as jwt from 'jsonwebtoken';
require('dotenv').config('../../.env');

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

export const generateToken = (data: any) => {
  return jwt.sign(data, JWT_SECRET_KEY as string, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const validateToken = (jwtToken: string) => {
  return jwt.verify(jwtToken, JWT_SECRET_KEY as string);
};
