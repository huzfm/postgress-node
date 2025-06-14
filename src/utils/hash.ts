import bcrypt from "bcrypt";
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};
export const compare = async (plainText: string, hash: string) => {
  return bcrypt.compare(plainText, hash);
};
