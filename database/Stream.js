const { DataTypes } = require('sequelize')
const Connection = require('./connection')
const Zone = require('./Zone')
const Group = require('./Group')
const Church = require('./Church')


const Stream = Connection.define("stream",{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    uuid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rtmpsUrl:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rtmpsStreamKey:{
        type:DataTypes.STRING,
        allowNull:false
    },
    recordingMode:{
        type:DataTypes.ENUM("OFF","AUTOMATIC"),
        allowNull:false,
        defaultValue:"OFF"
    },
})

Zone.hasMany(Cell)
Group.hasMany(Cell)
Church.hasMany(Cell)


Stream.sync()

module.exports = Stream