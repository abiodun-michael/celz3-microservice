const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Group = require("../database/Group")
const Church = require("../database/Church")
const Activity = require("../database/Activities")
const Cell = require("../database/Cell")
const Member = require("../database/Member")


const churchTypes = gql`

enum CHURCH_TYPE{
    NORMAL
    LANGUAGE
    CHILDREN
    TEEN
    ONLINE
}

    type ChurchMutationResponse{
        message:String
        status:Boolean
        church:Church
    }

    type ChurchList{
        church:[Church],
        group:Group
    }

    type Church{
        id:Int
        name:String
        address:String
        meetingTime:String
        latitude:String
        longitude:String
        totalMember:Int
        totalCell:Int
        type:String
        logo:String
        pastor:Member
        zone:Zone
        group:Group
        desc:String
    }

    input CreateChurchInput{
        name:String!
        address:String
        meetingTime:String
        latitude:String
        longitude:String
        type:CHURCH_TYPE!
        logo:String
        pastorId:Int
        zoneId:Int!
        groupId:Int!
        desc:String
    }

    input UpdateChurchInput{
        id:Int!
        name:String!
        address:String
        meetingTime:String
        latitude:String
        longitude:String
        type:CHURCH_TYPE!
        logo:String
        pastorId:Int
        zoneId:Int!
        groupId:Int!
        desc:String
    }


    extend type Query{
        getAllChurchByGroupId(id:Int!):ChurchList
        getChurchById(id:Int!):Church
    }

    extend type Mutation{
        createChurch(input:CreateChurchInput!):ChurchMutationResponse
        updateChurch(input:UpdateChurchInput!):ChurchMutationResponse
        deleteChurch(id:Int!):ChurchMutationResponse
    }
`


const churchResolvers = {
    Query:{
        getAllChurchByGroupId: async(_,{id},{user})=>{
        //    if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           const ch = await Church.findAll({where:{groupId:id}})
           const gr = await Group.findOne({where:{id}})
           return{
               church:ch,
               group:gr
           }
       },
       getChurchById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Church.findOne({where:{id}})
       }
    },
    
    Church:{
        zone:async({zoneId})=>{
            return await Zone.findOne({where:{id:zoneId}})
        },
        group:async({groupId})=>{
            return await Group.findOne({where:{id:groupId}})
        },
        totalMember:async({id})=>await Member.count({where:{churchId:id}}),
        totalCell:async({id})=>await Cell.count({where:{churchId:id}}),

    },
    Mutation:{
        createChurch: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            input.createdBy = user.id
            const [church, created] = await Church.findOrCreate({where:{name:input.name, groupId:input.groupId}, defaults:input})
            if(created){
                await Activity.create({note:`Church Id:${church.id} created`,actor:user.id})
                return{
                    message:"Church created!",
                    status:true,
                    church
                }
            }
            return{
                message:"Church already exist",
                status:false
            }
        },
        updateChurch: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const [church] = await Church.update(input,{where:{id:input.id}})
            if(church){
                await Activity.create({note:`Church Id:${input.id} Updated`,actor:user.id})
                return{
                    message:"Church updated!",
                    status:true,
                    church:input
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        },
        deleteChurch: async(_,{id},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const isDeleted = await Church.destroy({where:{id}})
            if(isDeleted){
                await Activity.create({note:`Church Id:${id} deleted`,actor:user.id})
                return{
                    message:"Church is deleted!",
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

module.exports = {churchTypes, churchResolvers}