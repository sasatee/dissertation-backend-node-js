const crypto = require("crypto");

const generateVerificationToken = () => {
  const verifytoken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(verifytoken).digest("hex");
  return { verifytoken, hashedToken };
};

module.exports = generateVerificationToken;
