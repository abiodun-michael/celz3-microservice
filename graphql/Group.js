const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Group = require("../database/Group")
const Activity = require("../database/Activities")
const Cell = require("../database/Cell")
const Member = require("../database/Member")
const Church = require("../database/Church")

const groupTypes = gql`

    type GroupMutationResponse{
        message:String
        status:Boolean
        group:Group
    }

    type Group{
        id:Int
        name:String
        logo:String
        pastor:Member
        totalCell:Int
        totalMember:Int
        zone:Zone
        desc:String
    }

    input CreateGroupInput{
        name:String!
        logo:String
        pastorId:Int
        zoneId:Int!
        desc:String
    }

    input UpdateGroupInput{
        id:Int!
        name:String!
        logo:String
        zoneId:Int!
        pastorId:Int
        desc:String
    }


    extend type Query{
        getAllGroupByZoneId(id:Int!):[Group]
        getGroupById(id:Int!):Group
    }

    extend type Mutation{
        createGroup(input:CreateGroupInput!):GroupMutationResponse
        updateGroup(input:UpdateGroupInput!):GroupMutationResponse
        deleteGroup(id:Int!):GroupMutationResponse
    }
`


const groupResolvers = {
    Query:{
        getAllGroupByZoneId: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Group.findAll({where:{zoneId:id}})
       },
       getGroupById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Group.findOne({where:{id}})
       }
    },
    Group:{
        zone:async({zoneId})=>{
            return await Zone.findOne({where:{id:zoneId}})
        },
        totalMember:async({id})=>await Member.count({where:{churchId:id}}),
        totalCell:async({id})=>await Cell.count({where:{churchId:id}}),

    },
    Mutation:{
        createGroup: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            input.createdBy = user.id
            const [group, created] = await Group.findOrCreate({where:{name:input.name}, defaults:input})
            if(created){
                await Activity.create({note:`Group Id:${group.id} created`,actor:user.id})
                return{
                    message:"Group created!",
                    status:true,
                    group
                }
            }
            return{
                message:"Group already exist",
                status:false
            }
        },
        updateGroup: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const [group] = await Group.update(input,{where:{id:input.id}})
            if(group){
                await Activity.create({note:`Group Id:${input.id} updated`,actor:user.id})
                return{
                    message:"Group updated!",
                    status:true,
                    group:input
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        },
        deleteGroup: async(_,{id},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const isDeleted = await Group.destroy({where:{id}})
            if(isDeleted){
                await Activity.create({note:`Group Id:${id} deleted`,actor:user.id})
                return{
                    message:"Group is deleted!",
                    status:true,
                    group:{id}
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        }
    }
}

module.exports = {groupTypes, groupResolvers}