module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      googleid: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      grade: DataTypes.STRING
    },
    {
      instanceMethods: {
        generateHash: function(password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
    }
  );

  User.associate = function(models) {
    User.belongsToMany(models.Task, { through: models.UserTask });
  };

  return User;
};
