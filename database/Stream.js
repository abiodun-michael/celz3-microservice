const { DataTypes } = require('sequelize')
const Connection = require('./connection')


const Stream = Connection.define("stream",{
    streamId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
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
    ownerType:{
        type:DataTypes.ENUM("ZONE","GROUP","CHURCH","CELL"),
        allowNull:false,
        allowNull:"ZONE"
    },
    ownerId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
})


Stream.sync({force:false})

module.exports = Stream