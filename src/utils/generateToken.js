import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payLoad = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  const secretKey = process.env.JWT_SECRET || "defaultSecretKey";
  const options = {
    expiresIn: "30d",
  };
  return jwt.sign(payLoad, secretKey, options);
};
export { generateToken };
