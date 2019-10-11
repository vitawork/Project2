module.exports = {
  development: {
    username:  process.env.HERUSER || process.env.USER,
    password: process.env.HERPASSWORD || process.env.PASSWORD ,
    database:  process.env.DB_DATABASE  || "cheetahdb",
    host:  process.env.DB_HOST || "localhost",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "testdb",
    host: "localhost",
    dialect: "mysql",
    logging: false
  },
  production: {
    use_env_variable: "JAWSDB_URL",
    dialect: "mysql"
  }
};
