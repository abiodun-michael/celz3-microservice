require('dotenv').config()
const Sequelize = require('sequelize-cockroachdb')


const Connection = new Sequelize({
    host: process.env.DB_HOST,
    dialect:process.env.DB_DIALECT,
    port:process.env.DB_PORT,
    username:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions:{
          ssl:{
              rejectUnauthorized:false
          }
      }
})

Connection.authenticate().then((response)=>{
    console.log(`Database connected!`)
}).catch((err)=>{
    console.error(err)
})


module.exports = Connection