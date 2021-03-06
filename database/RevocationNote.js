const Connection = require("./connection")
const {DataTypes} = require('sequelize')
const Admin = require("./Admin")


const RevocationNote = Connection.define("revocationNote",{
    reason:{
        type:DataTypes.STRING,
        allowNull:false
    },
    revokedBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
   
})

Admin.hasMany(RevocationNote)

RevocationNote.sync()


module.exports = RevocationNote