const Connection = require("./connection")
const {DataTypes} = require('sequelize')
const Admin = require('./Admin')


const Token = Connection.define("token",{
    ott:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

Admin.hasMany(Token)

Token.sync()


module.exports = Token