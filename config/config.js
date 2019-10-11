module.exports = {
  development: {
    username: process.env.USER || process.env.HERUSER,
    password: process.env.PASSWORD || process.env.HERPASSWORD,
    database: "cheetahdb" || process.env.DB_DATABASE,
    host: "localhost" || process.env.DB_HOST,
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
