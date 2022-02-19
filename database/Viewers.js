const { DataTypes } = require('sequelize')
const Connection = require('./connection')



const Viewer = Connection.define("viewer",{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    address:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    gender:{
        type:DataTypes.ENUM("MALE","FEMALE"),
        allowNull:true,
    }
})


Viewer.sync()

module.exports = Viewer