const { DataTypes } = require('sequelize')
const Connection = require('./connection')



const Template = Connection.define("template",{
    subject:{
        type: DataTypes.STRING,
        allowNull:false
    },
    message:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    type:{
        type:DataTypes.ENUM("DEFAULT","CUSTOM"),
        allowNull:false,
        defaultValue:"DEFAULT"
    },
    portal:{
        type:DataTypes.ENUM("CHURCH_MINISTRY","CELL_MINISTRY","FINANCE","PARTNERSHIP","MEDIA","FOUNDATION_SCHOOL"),
        allowNull:false
    },
    serviceType:{
        type:DataTypes.ENUM("ADMIN_ONBOARDING","ADMIN_PASSWORD_RESET","ADMIN_ACCOUNT_REVOKE"),
        allowNull:false
    },
    createdBy:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
    }
})


Template.sync()

module.exports = Template