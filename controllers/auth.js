const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.getLogin = (req, res, next) => {
  res.render("login", {
    heading: "Login",
    path: "/login",
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    heading: "Sign Up",
    path: "/signup",
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("Invalid EMial");
        return res.redirect("/login");
      }
      // console.log(user)
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          console.log("Invalid EMial or Password");
          res.redirect("/login");
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          res.redirect("/");
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;

  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.redirect("/signup");
    }
    return bcrypt
      .hash(password, 12)
      .then((hashPassword) => {
        const user = new User({
          email: email,
          password: hashPassword,
          notes: [],
        });
        return user.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getLogout = (req,res,next)=>{
  req.session.destroy((err)=>{
    res.redirect('/');
  })
}