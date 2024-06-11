const crypto = require("crypto");

const generateVerificationToken = () => {
  // const verifytoken = crypto.randomBytes(32).toString("hex");
  const verifytoken = Math.floor(1000000 * Math.random() * 10).toString();
  const hashedToken = crypto
    .createHash("sha256")
    .update(verifytoken)
    .digest("hex");
  return { verifytoken, hashedToken };
};

module.exports = generateVerificationToken;
