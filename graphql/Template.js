const {gql} = require("apollo-server")
const Template = require("../database/Templates")


const templateTypes = gql`

    enum TEMPLATE_TYPE{
        DEFAULT
        CUSTOM
    }

    enum SERVICE_TYPE{
        ADMIN_ONBOARDING
        ADMIN_PASSWORD_RESET
        ADMIN_ACCOUNT_REVOKE
    }

    enum PORTAL_TYPE{
        SUPER
        CHURCH_MINISTRY
        CELL_MINISTRY
        FINANCE
        PARTNERSHIP
        MEDIA
        FOUNDATION_SCHOOL
    }

    type TemplateMutationResponse{
        message:String
        status:Boolean
        template:Template
    }

    type Template{
        id:Int
        subject:String
        message:String
    }

    input CreateTemplateInput{
        subject:String!
        message:String!
        type:TEMPLATE_TYPE!
        portal:PORTAL_TYPE!
    }
    input UpdateTemplateInput{
        id:Int!
        subject:String!
        message:String!
        type:TEMPLATE_TYPE!
        portal:PORTAL_TYPE!
    }


    extend type Query{
        getAllTemplate:[Template]
        getTemplateById(id:Int!):Template
        getAllTemplateByType(type:String!):[Template]
        getAllTemplateByPortal(portal:String!):[Template]
    }

    extend type Mutation{
        createTemplate(input:CreateTemplateInput!):TemplateMutationResponse
        updateTemplate(input:UpdateTemplateInput!):TemplateMutationResponse
        deleteTemplate(id:Int!):TemplateMutationResponse
    }
`


const templateResolvers = {
    Query:{
        getAllTemplate: async(_,__,{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to access this resource",
                    status:false
                }
            }

            return await Template.findAll()

        },
        getAllTemplateByType: async(_,{type},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to access this resource",
                    status:false
                }
            }

            return await Template.findAll({where:{type}})

        },
        getAllTemplateByPortal: async(_,{portal},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to access this resource",
                    status:false
                }
            }

            return await Template.findAll({where:{portal}})

        },
        getTemplateById: async(_,{id},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to access this resource",
                    status:false
                }
            }

            return await Template.findOne({where:{id}})

        }
    }
}

module.exports = {templateTypes, templateResolvers}