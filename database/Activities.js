const { DataTypes } = require('sequelize')
const Connection = require('./connection')


const Activity = Connection.define("activity",{
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     defaultValue: 100,
    // },
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