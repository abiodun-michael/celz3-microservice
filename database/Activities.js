const { DataTypes } = require('sequelize')
const Connection = require('./connection')


const Activity = Connection.define("activity",{
    note:{
        type:DataTypes.STRING,
        allowNull:false
    },
    actor:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})


Activity.sync()

module.exports = Activity