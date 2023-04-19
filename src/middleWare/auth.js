const jwt = require('jsonwebtoken')

require('dotenv').config()

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "15s" });
}

function token(refreshToken) {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        console.log(accessToken)
        return accessToken;

    });

    console.log("here")

}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
    authenticateToken,
    refreshTokens,
    generateAccessToken,
    token
};
