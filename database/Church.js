const { DataTypes } = require('sequelize')
const Connection = require('./connection')
const Zone = require('./Zone')
const Group = require('./Group')


const Church = Connection.define("church",{
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
    address:{
        type:DataTypes.STRING,
        allowNull:true
    },
    meetingTime:{
        type:DataTypes.STRING,
        allowNull:true
    },
    latitude:{
        type:DataTypes.STRING,
        allowNull:true
    },
    longitude:{
        type:DataTypes.STRING,
        allowNull:true
    },
    type:{
        type:DataTypes.ENUM("NORMAL","LANGUAGE","CHILDREN","TEEN","ONLINE"),
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

Zone.hasMany(Church)
Group.hasMany(Church)
Church.sync()

module.exports = Church