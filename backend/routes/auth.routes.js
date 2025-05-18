const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.options("/api/auth/signin", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://world-explorer-eight.vercel.app");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
  });
  
  
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
};
