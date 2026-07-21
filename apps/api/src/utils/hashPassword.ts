import bcrypt from "bcrypt";
export const hashPassword = (plain_Password: string) => {
  return bcrypt.hash(plain_Password, 10);
};

export const comparePassword = (
  password_Hash: string,
  plain_Password: string,
) => {
  return bcrypt.compare(plain_Password, password_Hash);
};
