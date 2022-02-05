const Connection = require("./connection")
const {DataTypes} = require('sequelize')


const Admin = Connection.define("admin",{
    fullName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    photoUrl:{
        type:DataTypes.STRING,
        allowNull:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    portalAccess:{
        type:DataTypes.ENUM("SYSTEM","ZONE","GROUP","CHURCH","CELL"),
        allowNull:false
    },
    permissions:{
        type:DataTypes.ENUM("SYSTEM","CHURCH_MINISTRY","CELL_MINISTRY","FINANCE","PARTNERSHIP","MEDIA","FOUNDATION_SCHOOL","MEMBER","CELL_LEADER"),
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM("SYSTEM","ADMIN","EDITOR","VIEWER"),
        allowNull:false
    },
    cellId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    groupId:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    zoneId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:true
    },
    lastSeen:{
        type:DataTypes.DATE,
        allowNull:true
    },
    isAcceptInvite:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    invitedBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
})



Admin.sync({force:false})


module.exports = Admin