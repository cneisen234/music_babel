const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");
const PORT = process.env.PORT || 5000;

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for angular requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build'));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/** ---------- EXPRESS ROUTES ---------- **/
const userRouter = require("./routes/user.router");
const musicRouter = require("./routes/music.router.js"); //routes to feedback.router.js
app.use("/music", musicRouter);
app.use("/api/user", userRouter);

/** ---------- START SERVER ---------- **/
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});