//Stateless Server Configuration

// Use Express
var express = require("express");
var session = require("express-session")
// Use body-parser and cookie-parser
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
// Use csrf-csrf for CSRF Protection using Double Submit Cookie Pattern)
const { doubleCsrf } = require("csrf-csrf");
// Use dotenv to store secrets
require('dotenv').config()

// Secrets and important params might be used with env files
// in this case you can set and change this values to test purposes
const CSRF_SECRET = process.env.csrf_secret;
const COOKIES_SECRET = process.env.cookie_secret;
const CSRF_COOKIE_NAME = "app-csrf-token";

// Create new instance of the express server
const app = express();
app.use(express.json());

// create application/json parser
var jsonParser = bodyParser.json()

// These settings are only for local development testing.
// Do not use these in production.
// In production, ensure you're using cors and helmet and have proper configuration.
const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: (req) => req.secret,
    secret: CSRF_SECRET,
    cookieName: CSRF_COOKIE_NAME,
    cookieOptions: { sameSite: true, secure: true, signed: true }, // not ideal for production, development only
    size: 128,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => req.headers["app-csrf-token"], // A function that returns the token from the request
  });

app.use(cookieParser(COOKIES_SECRET));

// Settings for all requests
app.all('*', jsonParser, function(req, res, next){

    console.log(
        "************ NEW REQUEST ************", '\n',
        'req.path:', req.path, '\n',
        'req.headers:', req.headers, '\n',
        'req.body:', req.body
    ); // For debugging

    next();
});

// Error handling, validation error interception
const csrfErrorHandler = (error, req, res, next) => {
    // Handing CSRF mismatch errors
    // For production use: send to a logger
    console.log("ERROR:", error)
    if (error == invalidCsrfTokenError) {
      res.status(403).json({
        error: "csrf validation error",
      });
    } else {
      next();
    }
};

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist/angular-stateless` folder.
var distDir = __dirname + "/dist/angular-stateless";
app.use(express.static(distDir));

// Init the server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get("/csrf-token", (req, res) => {
    return res.json({
        token: generateToken(res, req),
    });
});
  
app.post(
    "/protected_endpoint",
    doubleCsrfProtection,
    csrfErrorHandler,
    (req, res) => {
      console.log("req.body:", req.body);
      res.json({
        protected_endpoint: "form processed successfully",
      });
    }
);

