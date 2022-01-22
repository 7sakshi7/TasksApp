const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const path = require("path");

// User model
const User = require('./models/User');

const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");

// url for connecting to mongo db
const MONGO_DB_URI =
  "mongodb+srv://sakshi:sakshi@cluster0.v2o4h.mongodb.net/notesapp?&w=majority";

//   creating object of express
const app = express();

// setting engine as ejs
app.set("view engine", "ejs");
app.set("views", "views");

// for parsing body
app.use(bodyParser.urlencoded({ extended: false }));

// forwarding to public folder for css
app.use(express.static(path.join(__dirname, "public")));

// creating store for sessions
const store = new mongoDbStore({
  uri: MONGO_DB_URI,
  collection: "sessions",
});

// creating session
app.use(
  session({
    secret: "my secret keys",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// checking user already exist or not
app.use((req, res, next) => {
    if (req.session.user == undefined) {
      return next();
    }
    User.findById(req.session.user._id).then((user) => {
      req.user = user;
      next();
    });
  });
  
  // routes
  app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  })
  app.use(authRoutes);
  app.use(notesRoutes);

// connecting to databse
mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
