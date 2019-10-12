module.exports = {
  development: {
    username:  "ties3yik7jlhsysn",
    password: "tvhmwesh6nw7lths" ,
    database:  "vvvmugfmw7thrhdj",
    host:  "s3lkt7lynu0uthj8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
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
