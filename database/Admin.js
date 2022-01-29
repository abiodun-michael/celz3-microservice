const Connection = require("./connection")
const {DataTypes} = require('sequelize')


const Admin = Connection.define("admin",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: 100,
    },
    fullName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    portalAccess:{
        type:DataTypes.ENUM("SUPER","ZONAL","GROUP","CHURCH","CELL"),
        allowNull:false
    },
    permissions:{
        type:DataTypes.ENUM("SUPER","CHURCH_MINISTRY","CELL_MINISTRY","FINANCE","PARTNERSHIP","MEDIA","FOUNDATION_SCHOOL"),
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM("SUPER","ADMIN","EDITOR","VIEWER"),
        allowNull:false
    },
    profileId:{
        type:DataTypes.INTEGER,
        allowNull:true
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
        defaultValue:1
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



Admin.sync()


module.exports = Admin