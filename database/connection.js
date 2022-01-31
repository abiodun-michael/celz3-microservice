require('dotenv').config()
const Sequelize = require('sequelize')


const Connection = new Sequelize(process.env.DATABASE_URL,{
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