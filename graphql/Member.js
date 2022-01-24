const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Group = require("../database/Group")
const Church = require("../database/Church")
const Cell = require("../database/Cell")
const Member = require("../database/Member")


const memberTypes = gql`

    enum GENDER_TYPE{
        MALE
        FEMALE
    }

    enum MARITAL_STATUS_TYPE{
        SINGLE
        MARRIED
        DIVORCED
        WIDOW
    }

    enum TITLE_TYPE{
        BROTHER
        SISTER
        PASTOR
        DEACON
        DEACONNESS
    }

    enum DESIGNATION_TYPE{
        COORDINATOR
        CELL_LEADER
        CELL_EXECUTIVE
        PASTOR
        PASTORAL_ASSISTANT
    }

    enum EMPLOYMENT_STATUS_TYPE{
        EMPLOYED
        SELF_EMPLOYED
        UN_EMPLOYED
    }

    enum EDUCATION_STATUS_TYPE{
        UNDERGRADUATE
        GRADUATE
    }

    extend type MemberMutationResponse{
        message:String
        status:Boolean
        member:Member
    }

    type Member{
        id:Int
        firstName:String
        lastName:String
        phoneNumber:String
        email:String
        address:String
        state:String
        country:String
        gender:GENDER_TYPE
        maritalStatus:MARITAL_STATUS_TYPE
        title:TITLE_TYPE
        designation:DESIGNATION_TYPE
        employmentStatus:EMPLOYMENT_STATUS_TYPE
        educationStatus:EDUCATION_STATUS_TYPE
        foundationSchool:Boolean
        isMember:Boolean
        zone:Zone
        group:Group
        church:Church
        cell:Cell
    }

    input CreateMemberInput{
        firstName:String!
        lastName:String!
        phoneNumber:String
        email:String
        address:String
        state:String
        country:String!
        gender:GENDER_TYPE!
        maritalStatus:MARITAL_STATUS_TYPE
        title:TITLE_TYPE!
        designation:DESIGNATION_TYPE
        employmentStatus:EMPLOYMENT_STATUS_TYPE
        educationStatus:EDUCATION_STATUS_TYPE
        foundationSchool:Boolean
        zoneId:Int!
        groupId:Int!
        churchId:Int!
        cellId:Int
    }

    input UpdateMemberInput{
        id:Int!
        firstName:String!
        lastName:String!
        phoneNumber:String
        email:String
        address:String
        state:String
        country:String!
        gender:GENDER_TYPE!
        maritalStatus:MARITAL_STATUS_TYPE
        title:TITLE_TYPE!
        designation:DESIGNATION_TYPE
        employmentStatus:EMPLOYMENT_STATUS_TYPE
        educationStatus:EDUCATION_STATUS_TYPE
        foundationSchool:Boolean
        zoneId:Int!
        groupId:Int!
        churchId:Int!
        cellId:Int
    }


    extend type Query{
        getAllMemberByChurchId(id:Int!):[Member]
        getMemberById(id:Int!):Member
    }

    extend type Mutation{
        createMember(input:CreateMemberInput!):MemberMutationResponse
        updateMember(input:UpdateChurchInput!):MemberMutationResponse
        deleteMember(id:Int!):MemberMutationResponse
    }
`


const memberResolvers = {
    Query:{
        getAllMemberByChurchId: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Member.findAll({where:{churchId:id}})
       },
       getMemberById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Member.findOne({where:{id}})
       }
    },
    Member:{
        zone:async({zoneId})=>{
            return await Zone.findOne({where:{id:zoneId}})
        },
        group:async({groupId})=>{
            return await Group.findOne({where:{id:groupId}})
        },
        church:async({churchId})=>{
            return await Church.findOne({where:{id:churchId}})
        },
        cell:async({cellId})=>{
            return await Cell.findOne({where:{id:cellId}})
        },
    },
    Mutation:{
        createMember: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            input.createdBy = user.id
            const [member, created] = await Member.findOrCreate({where:{firstName:input.firstName, lastName:input.lastName, churchId:input.churchId, phoneNumber:input.phoneNumber}, defaults:input})
            if(created){
                await Activity.create({note:`Member Id:${member.id} created`,actor:user.id})
                return{
                    message:"Member created!",
                    status:true,
                    member
                }
            }
            return{
                message:"Member already exist",
                status:false
            }
        },
        updateMember: async(_,{input},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            
            const [member] = await Member.update(input,{where:{id:input.id}})
            if(member){
                await Activity.create({note:`Member Id:${input.id} updated`,actor:user.id})
                return{
                    message:"Church updated!",
                    status:true,
                    member:input
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        },
        deleteMember: async(_,{id},{user})=>{
            if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
            const isDeleted = await Member.destroy({where:{id}})
            if(isDeleted){
                await Activity.create({note:`Member Id:${id} deleted`,actor:user.id})
                return{
                    message:"Member is deleted!",
                    status:true,
                    member:{id}
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        }
    }
}

module.exports = {memberTypes, memberResolvers}