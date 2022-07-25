const connections = {
    development: {
      client: "mysql",
      connection: {
        host: "127.0.0.1",
        user: "root",
        // password: process.env.DB_KEY,
        password: "Yyh779955",
        database: "jwt_auth_booktown",
        cartset: "utf8",
      },
    },
  
    production: {
      client: "mysql",
      connection: process.env.JAWSDB_URL,
    },
  };
  
  module.exports =
    process.env.NODE_ENV === "production"
      ? connections.production
      : connections.development;
  