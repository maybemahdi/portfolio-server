/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: number | string,
) => {
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  };

  const token = jwt.sign(payload, secret, options);

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
