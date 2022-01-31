const { DataTypes } = require('sequelize')
const Connection = require('./connection')
const Zone = require('./Zone')


const Group = Connection.define("group",{
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     defaultValue: 100,
    // },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    logo:{
        type:DataTypes.STRING,
        allowNull:true
    },
    pastorId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    desc:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
})

Zone.hasMany(Group)
Group.sync()

module.exports = Group