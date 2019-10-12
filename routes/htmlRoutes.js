var db = require("../models");

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.render("signup");
  } else {
    next();
  }
};

function checkrole(user) {
  var tohand = {
    user: user
  };

  if (user.role == "Teacher") {
    tohand.teacher = true;
  }
  if (user.role == "Volunteer") {
    tohand.volunteer = true;
  }
  if (user.role == "Coordinator") {
    tohand.coordinator = true;
  }
  return tohand;
}

module.exports = function(app) {
  // Load index page
  app.get("/", authCheck, function(req, res) {
    db.User.count({
      where: { role: "Volunteer" }
    }).then(amount => {
      var tohand = checkrole(req.user);
      tohand.tvolunteers = amount;
      db.Task.count({
        where: { state: "Done" }
      }).then(amount => {
        tohand.tdonetasks = amount;
        db.Task.count({
          where: { state: "Unassigned" }
        }).then(amount => {
          tohand.tunnatasks = amount;
          db.Task.count({
            where: { state: "Assigned" }
          }).then(amount => {
            tohand.tassigtasks = amount;

            res.render("dashboard", tohand);
          });
        });
      });
    });
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.get("/assignTask", authCheck, function(req, res) {
    var tohand = checkrole(req.user);
    db.Task.findAll({
      where: {
        state: "Unassigned"
      }
    }).then(function(Tasks) {
      tohand.tasks = Tasks;
      db.User.findAll({
        where: {
          role: "Volunteer"
        }
      }).then(function(Vol) {
        tohand.vol = Vol;
        res.render("assignTask", tohand);
      });
    });
  });

  app.get("/newtask", authCheck, function(req, res) {
    res.render("newtask", checkrole(req.user));
  });

  app.get("*", function(req, res) {
    res.redirect("/");
  });
};
