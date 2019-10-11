module.exports = function(sequelize, DataTypes) {
  var UserTask = sequelize.define("UserTask", {});

  UserTask.associate = function(models) {
    UserTask.belongsTo(models.User);
    UserTask.belongsTo(models.Task);
  };

  return UserTask;
};
