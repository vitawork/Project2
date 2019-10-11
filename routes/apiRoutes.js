var db = require("../models");
const bcrypt = require("bcrypt");

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.render("login");
  } else {
    next();
  }
};

function checkrole(user, datab) {
  var tohand = {
    user: user
  };
  if (datab) {
    tohand.datab = datab;
  }

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
  // Get all tasks
  app.get("/api/tasks", authCheck, function(req, res) {
    db.Task.findAll({}).then(function(Tasks) {
      res.render("Tasks", checkrole(req.user, Tasks));
    });
  });

  // Get all unassigned tasks
  app.get("/api/unassignedtasks", authCheck, function(req, res) {
    db.Task.findAll({
      where: {
        state: "Unassigned"
      }
    }).then(function(Tasks) {
      res.render("UnTasks", checkrole(req.user, Tasks));
    });
  });

  // Get all assigned tasks
  app.get("/api/assignedtasks", authCheck, function(req, res) {
    db.Task.findAll({
      where: { state: "Assigned" },
      include: [
        {
          model: db.User,
          where: { role: "Volunteer" }
        }
      ]
    }).then(tasks => {
      res.render("assignedTask", checkrole(req.user, tasks));
    });
  });

  // Get all tasks from a logged teacher
  app.get("/api/teachertasks", function(req, res) {
    db.UserTask.findAll({
      where: { UserId: req.user.id },
      order: ["Task", "createdAt", "DESC"],
      include: [db.Task]
    }).then(function(tasks) {
      res.json(tasks);
    });
  });

  //Assigning a task to a volunteer{{task}, volunterrid}
  app.post("/api/assigningtask", authCheck, function(req, res) {
    db.Task.update(
      { state: "Assigned" },
      {
        where: {
          id: req.body.task
        }
      }
    ).then(function(t) {
      db.UserTask.create({
        TaskId: req.body.task,
        UserId: req.body.volunteer
      }).then(function(usertask) {
        res.redirect("/");
      });
    });
  });

  //A volunteer picking a task {task}
  app.get("/api/pickingtask", function(req, res) {
    db.Task.update(
      { state: "Assigned" },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function(t) {
      db.UserTask.create({
        TaskId: task.id,
        UserId: req.user.id
      }).then(function(usertask) {
        res.end();
      });
    });
  });

  //Checking Out a task {task}
  app.put("/api/checkouttask", function(req, res) {
    db.Task.update(
      { state: "Done" },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function(task) {
      res.end();
    });
  });

  //Adding a new task{task}
  app.post("/api/newtask", function(req, res) {
    db.Task.create({
      task_name: req.body.task_name,
      description: req.body.description,
      quantity: req.body.quantity,
      dueDate: req.body.dueDate,
      estimatedTime: req.body.estimatedTime * 100,
      state: "Unassigned"
    }).then(function(task) {
      db.UserTask.create({
        TaskId: task.dataValues.id,
        UserId: req.user.id
      }).then(function(usertask) {
        res.redirect("/");
      });
    });
  });

  //Editing a task{task}
  app.put("/api/edittask", function(req, res) {
    db.Task.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(task) {
      res.json(task);
    });
  });

  //Removing a task(id on the path)
  app.delete("/api/task/:id", function(req, res) {
    db.Task.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(task) {
      res.end();
    });
  });

  //Adding a new User{user}
  app.post("/api/newuser", function(req, res) {
    db.User.findOne({
      where: { email: req.body.email }
    }).then(function(user) {
      if (user) {
        res.render("signup", {
          message: "You already have an account",
          SI: true
        });
      } else {
        db.User.findOne({
          where: { username: req.body.username }
        }).then(function(user) {
          if (user) {
            res.render("signup", { message: "The username is already in use" });
          } else {
            db.User.create({
              name: req.body.name,
              email: req.body.email,
              username: req.body.username,
              password: bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(8),
                null
              ),
              phone: req.body.phone,
              role: req.body.role
            }).then(function(user) {
              res.redirect("/");
            });
          }
        });
      }
    });
  });

  //Editing a user{user}
  app.put("/api/editinguser", function(req, res) {
    db.User.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(user) {
      res.json(user);
    });
  });

  //Removing a user(id on the path)
  app.delete("/api/user/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      res.end();
    });
  });

  // Get all users
  app.get("/api/users", function(req, res) {
    db.User.findAll({}).then(function(users) {
      res.json(users);
    });
  });

  // Get all volunteers
  app.get("/api/volunteers", authCheck, function(req, res) {
    db.User.findAll({
      where: {
        role: "Volunteer"
      }
    }).then(function(users) {
      res.render("volunteers", checkrole(req.user, users));
    });
  });

  //   //to seed the user table
  //   app.post("/api/new", function(req, res) {
  //     db.User.create({
  //       name: "Kimberly",
  //       email: "kimberly@gmail.com",
  //       username: "kimberly",
  //       password: bcrypt.hashSync("kimberly", bcrypt.genSaltSync(8), null),
  //       phone: "8325657345",
  //       role: "Teacher",
  //       grade: "A1"
  //     }).then(function(user) {
  //       res.json(user);
  //     });
  //   });
};
