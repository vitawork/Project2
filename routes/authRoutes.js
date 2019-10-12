const router = require("express").Router();
const passport = require("passport");

//auth login
router.get("/login", (req, res) => {
  res.redirect("/");
});

//auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/login", (req, res, next) => {
  
  console.log("XXXXXXX1lXXXXXXXX "+JSON.stringify(req.body));
  console.log("XXXXXXXX1lXXXXXXX "+JSON.stringify(req.user));
  passport.authenticate("local", (err, user, info) => {
    if (user) {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        
        return res.redirect("/");
      });
    } else {
      
  console.log("XXXXXXX2lloginXXXXXXXX "+JSON.stringify(req.body));
  console.log("XXXXXXXX2lloginXXXXXXX "+JSON.stringify(req.user));
  
  console.log("XXXXXXXX2lloginXXXXXXX "+JSON.stringify(user));
      return res.render("login", info);
    }
  })(req, res, next);
});

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

//callback route for google to redirect to
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/signup" }),
  (req, res) => {
    console.log("XXXXXXX2gXXXXXXXX "+JSON.stringify(req.body));
    console.log("XXXXXXXX2gXXXXXXX "+JSON.stringify(req.user));
    res.redirect("/");
  }
);

module.exports = router;
