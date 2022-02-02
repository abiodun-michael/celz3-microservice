const { DataTypes } = require('sequelize')
const Connection = require('./connection')
const Zone = require('./Zone')


const Program = Connection.define("program",{
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    desc:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    type:{
        type:DataTypes.ENUM("ONSITE","ONLINE"),
        allowNull:false
    },
    startedDate:{
        type:DataTypes.DATE,
        allowNull:true
    },
    endDate:{
        type:DataTypes.DATE,
        allowNull:true
    },
    meetingTime:{
        type:DataTypes.TIME,
        allowNull:true
    },
    visibility:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
})

Zone.hasMany(Program)


Program.sync()

module.exports = Program