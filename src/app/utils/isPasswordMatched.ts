import bcrypt from "bcrypt";
// Helper functions
const isPasswordMatched = async (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(givenPassword, savedPassword);
};
export default isPasswordMatched;
