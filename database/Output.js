const { DataTypes } = require('sequelize')
const Connection = require('./connection')
const Stream = require('./Stream')


const Output = Connection.define("output",{
    outputId:{
        type:DataTypes.STRING,
        allowNull:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    },
    streamKey:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
  
})

Stream.hasMany(Output)

Output.sync()

module.exports = Output