const { DataTypes } = require('sequelize')
const Connection = require('./connection')
const Zone = require('./Zone')
const Group = require('./Group')
const Cell = require('./Cell')
const Church = require('./Church')


const Member = Connection.define("member",{
    firstName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:true
    },
    address:{
        type:DataTypes.STRING,
        allowNull:true
    },
    state:{
        type:DataTypes.STRING,
        allowNull:true
    },
    country:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.ENUM("MALE","FEMALE"),
        allowNull:false
    },
    maritalStatus:{
        type:DataTypes.ENUM("SINGLE","MARRIED","DIVORCED","WIDOW"),
        allowNull:false,
        defaultValue:"SINGLE"
    },
    title:{
        type:DataTypes.ENUM("BROTHER","SISTER","PASTOR","DEACON","DEACONNESS"),
        allowNull:false
    },
    designation:{
        type:DataTypes.ENUM("COORDINATOR","CELL_LEADER","CELL_EXECUTIVE","PASTOR","PASTORAL_ASSISTANT"),
        allowNull:true
    },
    employmentStatus:{
        type:DataTypes.ENUM("EMPLOYED","SELF_EMPLOYED","UN_EMPLOYED"),
        allowNull:true
    },
    educationStatus:{
        type:DataTypes.ENUM("UNDERGRADUATE","GRADUATE"),
        allowNull:true
    },
    foundationSchool:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    },
    baptism:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    },

    isMember:{
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

Zone.hasMany(Member)
Group.hasMany(Member)
Church.hasMany(Member,{allowNull:true})
Cell.hasMany(Member,{allowNull:true})


Member.sync()

module.exports = Member