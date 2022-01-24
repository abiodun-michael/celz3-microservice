const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Activity = require("../database/Activities")


const zoneTypes = gql`

    type ZoneMutationResponse{
        message:String
        status:Boolean
        zone:Zone
    }

    type Zone{
        id:Int
        name:String
        logo:String
    }

    input CreateZoneInput{
        name:String!
        logo:String
    }

    input UpdateZoneInput{
        id:Int!
        name:String!
        logo:String
    }


    extend type Query{
        getAllZone:[Zone]
        getZoneById(id:Int!):Zone
    }

    extend type Mutation{
        createZone(input:CreateZoneInput!):ZoneMutationResponse
        updateZone(input:UpdateZoneInput!):ZoneMutationResponse
        deleteZone(id:Int!):ZoneMutationResponse
    }
`


const zoneResolvers = {
    Query:{
       getAllZone: async(_,__,{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Zone.findAll()
       },
       getZoneById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Zone.findOne({where:{id}})
       }
    },

    Mutation:{
        createZone: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            input.createdBy = user.id
            const [zone, created] = await Zone.findOrCreate({where:{name:input.name}, defaults:input})
            if(created){
                await Activity.create({note:`Zone Id:${zone.id} created`,actor:user.id})
                return{
                    message:"Zone created!",
                    status:true,
                    zone
                }
            }
            return{
                message:"Zone already exist",
                status:false
            }
        },
        updateZone: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const [zone] = await Zone.update(input,{where:{id:input.id}})
            if(zone){
                await Activity.create({note:`Zone Id:${input.id} updated`,actor:user.id})
                return{
                    message:"Zone updated!",
                    status:true,
                    zone:input
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        },
        deleteZone: async(_,{id},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const isDeleted = await Zone.destroy({where:{id}})
            if(isDeleted){
                await Activity.create({note:`Zone Id:${id} deleted`,actor:user.id})
                return{
                    message:"Zone is deleted!",
                    status:true,
                    zone:{id}
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        }
    }
}

module.exports = {zoneTypes, zoneResolvers}