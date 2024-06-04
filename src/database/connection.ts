// require("dotenv").config();
// var typeorm = require("typeorm");

// const getConfig = (type) => {
//   let obj = {
//     development: {
//       type: "mysql",
//       host: "localhost",
//       port: 3306,
//       username: "root",
//       password: "12345678",
//       database: "socialapp",
//       synchronize: true,
//       logging: true,
//       entities: ["src/database/tables/*.ts"],
//       migrations: [],
//       subscribers: []
//     },
//     production: {
//       type: "mysql",
//       host: "localhost",
//       port: 3306,
//       username: "your_username",
//       password: "your_password",
//       database: "your_database_name",
//       synchronize: true,
//       logging: true,
//       entities: ["src/entities/*.ts"],
//       migrations: [],
//       subscribers: []
//     }
//   };
//   return obj[type];
// };

// export default new typeorm.DataSource(getConfig("development"));
