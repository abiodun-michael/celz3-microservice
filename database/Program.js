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
    startDate:{
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
    category:{
        type:DataTypes.ENUM("GROUP_PASTORS","PASTORS","CELL_LEADER","STAFF","COORDINATORS","ALL","OTHERS"),
        allowNull:false,
        defaultValue:"ALL"
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


Program.sync({force:false})

module.exports = Program