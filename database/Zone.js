const { DataTypes } = require('sequelize')
const Connection = require('./connection')



const Zone = Connection.define("zone",{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    logo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
})


Zone.sync()

module.exports = Zone