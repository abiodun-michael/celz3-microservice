const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Activity = require("../database/Activities")
const Program = require("../database/Program")


const programTypes = gql`

enum PROGRAM_CATEGORY{
    GROUP_PASTORS
    PASTORS
    CELL_LEADER
    STAFF
    COORDINATORS
    ALL
    OTHERS
}

    enum PROGRAM_TYPE{
        ONLINE
        ONSITE
    }

    type ProgramMutationResponse{
        message:String
        status:Boolean
        program:Program
    }

    type Program @key(fields:"id"){
        id:Int
        title:String
        desc:String
        startDate:String
        endDate:String
        meetingTime:String
        type:PROGRAM_TYPE
        visibility:Boolean
        category:PROGRAM_CATEGORY
    }

    input CreateProgramInput{
        title:String!
        startDate:String
        endDate:String
        meetingTime:String
        desc:String
        type:PROGRAM_TYPE!
        category:PROGRAM_CATEGORY!
    }

    input UpdateProgramInput{
        id:Int!
        title:String!
        startDate:String
        endDate:String
        meetingTime:String
        desc:String
        type:PROGRAM_TYPE!
        visibility:Boolean
        category:PROGRAM_CATEGORY!
    }


    extend type Query{
        getAllProgram:[Program]
        getProgramById(id:Int!):Program
    }

    extend type Mutation{
        createProgram(input:CreateProgramInput!):ProgramMutationResponse
        updateProgram(input:UpdateProgramInput!):ProgramMutationResponse
        deleteProgram(id:Int!):ProgramMutationResponse
    }
`


const programResolvers = {
    Query:{
       getAllProgram: async(_,__,{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Program.findAll()
       },
       getProgramById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Program.findOne({where:{id}})
       }
    },

    Mutation:{
        createProgram: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            input.createdBy = user.id
            if(!user.zoneId){
                input.zoneId = 1
            }
            const [program, created] = await Program.findOrCreate({where:{title:input.title}, defaults:input})
            if(created){
                await Activity.create({note:`Program Id:${zone.id} created`,actor:user.id})
                return{
                    message:"Program created!",
                    status:true,
                    program
                }
            }
            return{
                message:"Program already exist",
                status:false
            }
        },
        updateProgram: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const [program] = await Program.update(input,{where:{id:input.id}})
            if(program){
                await Activity.create({note:`Program Id:${input.id} updated`,actor:user.id})
                return{
                    message:"Program updated!",
                    status:true,
                    program:input
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        },
        deleteProgram: async(_,{id},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const isDeleted = await Program.destroy({where:{id}})
            if(isDeleted){
                await Activity.create({note:`Program Id:${id} deleted`,actor:user.id})
                return{
                    message:"Program is deleted!",
                    status:true,
                    program:{id}
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        }
    }
}

module.exports = {programTypes, programResolvers}