// Use Express
var express = require("express");
var session = require("express-session")
// Use body-parser
var bodyParser = require("body-parser");
// Use csrf-sync for CSRF Protection
var { csrfSync } = require("csrf-sync");
// Use dotenv to store cookie secret
require('dotenv').config()


// Create new instance of the express server
var app = express();

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Add csrf protection
app.use(session({
    secret: process.env.cookie_secret,
    resave: true,
    saveUninitialized: true
}));

// Setting up Csrf Protection
const { 
    generateToken, 
    csrfSynchronisedProtection, 
    storeTokenInState, 
    getTokenFromState 
} = csrfSync({
    getTokenFromState: (req) => { 
        // Used to retrieve the token from state.
        return req.session.csrfToken; 
    }, 
    getTokenFromRequest: (req) =>  { 
        // Used to retrieve the token submitted by the request from headers
        // Change the header name (default is 'x-csrf-token')
        return req.headers['app-csrf-token']; //  <-- uncomment to use

        // The following is an alternative approach using the token in a form (POST) request
        // Used to retrieve the token submitted by the user in a form 
        // return req.body['CSRFToken']; // <-- uncomment to use
    },
    storeTokenInState: (req, token) => { 
        // Used to store the token in state. 
        req.session.csrfToken = token; 
    }, 
    size: 256, // The size of the generated tokens in bits
});

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist/angular-stateful` folder.
var distDir = __dirname + "/dist/angular-stateful";
app.use(express.static(distDir));

// Init the server
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});


// Settings for all requests
app.all('*', jsonParser, function(req, res, next){
    // getTokenFromState for all requests
    var syncedToken = getTokenFromState(req);

    // If token isn't present generate a new token
    if(syncedToken === undefined){
        var token = generateToken(req);
        storeTokenInState(req, token)
    } 

    console.log(
        "************ NEW REQUEST ************", '\n',
        'req.path:', req.path, '\n',
        'req.body:', req.body
    ); // For debugging

    next();
});

// In Angular app component OnInit a request is made to `/csrf-token` go generate new token
app.get("/csrf-token", (req, res) => {
    // send the token to the client
    var csrfToken = getTokenFromState(req)
    return res.send({csrfToken: csrfToken});
});

// Add the csrfSynchronisedProtection
// Any requests after this init will be csrf protected
app.use(csrfSynchronisedProtection);

// CSRF Protected POST endpoint
// Client POST request sent to CSRF Endpoint
app.post("/process", jsonParser, (req, res) => {
    res.status(200).json({ status: "success" });
});
