const express = require("express");
const path = require("path");
const helmet = require("helmet");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dist")));

app.use(helmet());

const safePath = path.join(__dirname, "dist", "index.html");

app.get("*", (_, res) => {
  // Add security headers
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  });

  res.sendFile(safePath);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
