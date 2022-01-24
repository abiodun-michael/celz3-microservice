const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Group = require("../database/Group")
const Church = require("../database/Church")
const Cell = require("../database/Cell")
const Activity = require("../database/Activities")


const cellTypes = gql`

enum CELL_TYPE{
    NORMAL
    ONLINE
}

    type CellMutationResponse{
        message:String
        status:Boolean
        cell:Cell
    }

    type Cell{
        id:Int
        name:String
        address:String
        meetingTime:String
        latitude:String
        longitude:String
        type:CELL_TYPE
        logo:String
        leader:String
        desc:String
        zone:Zone
        group:Group
        church:Church
    }

    input CreateCellInput{
        name:String!
        address:String
        meetingTime:String
        latitude:String
        longitude:String
        type:CELL_TYPE!
        logo:String
        leader:String
        desc:String
        zoneId:Int!
        groupId:Int!
        churchId:Int!
    }

    input UpdateCellInput{
        id:Int!
        name:String!
        address:String
        meetingTime:String
        latitude:String
        longitude:String
        type:CELL_TYPE!
        logo:String
        leader:String
        desc:String
        zoneId:Int!
        groupId:Int!
        churchId:Int!
    }


    extend type Query{
        getAllCellByChurchId(id:Int!):[Cell]
        getCellById(id:Int!):Cell
    }

    extend type Mutation{
        createCell(input:CreateCellInput!):CellMutationResponse
        updateCell(input:UpdateCellInput!):CellMutationResponse
        deleteCell(id:Int!):CellMutationResponse
    }
`


const cellResolvers = {
    Query:{
        getAllCellByChurchId: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Cell.findAll({where:{churchId:id}})
       },
       getCellById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Cell.findOne({where:{id}})
       }
    },
    Cell:{
        zone:async({zoneId})=>{
            return await Zone.findOne({where:{id:zoneId}})
        },
        group:async({groupId})=>{
            return await Group.findOne({where:{id:groupId}})
        },
        church:async({churchId})=>{
            return await Church.findOne({where:{id:churchId}})
        },
    },
    Mutation:{
        createCell: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            input.createdBy = user.id
            const [cell, created] = await Cell.findOrCreate({where:{name:input.name, churchId:input.churchId}, defaults:input})
            if(created){
                await Activity.create({note:`Cell Id:${cell.id} created`,actor:user.id})
                return{
                    message:"Cell created!",
                    status:true,
                    cell
                }
            }
            return{
                message:"Cell already exist",
                status:false
            }
        },
        updateCell: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const [cell] = await Cell.update(input,{where:{id:input.id}})
            if(cell){
                await Activity.create({note:`Cell Id:${input.id} Updated`,actor:user.id})
                return{
                    message:"Cell updated!",
                    status:true,
                    cell:input
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        },
        deleteCell: async(_,{id},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const isDeleted = await Cell.destroy({where:{id}})
            if(isDeleted){
                await Activity.create({note:`Cell Id:${id} deleted`,actor:user.id})
                return{
                    message:"Cell is deleted!",
                    status:true,
                    cell:{id}
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        }
    }
}

module.exports = {cellTypes, cellResolvers}