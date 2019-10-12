module.exports = {
  development: {
    username: process.env.USER || process.env.DB_USER,
    password: process.env.PASSWORD || process.env.DB_PASSWORD,
    database: "cheetahdb" || process.env.DB_DATABASE,
    host: "localhost" || process.env.DB_HOST,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "testdb",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    username: process.env.USER || process.env.DB_USER,
    password: process.env.PASSWORD || process.env.DB_PASSWORD,
    database: "cheetahdb" || process.env.DB_DATABASE,
    host: "localhost" || process.env.DB_HOST,
    dialect: "mysql"
  }
};
