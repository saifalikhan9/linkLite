import * as crypto from "node:crypto";

export const generateGuestToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

export const genereateGuestToken = generateGuestToken;
