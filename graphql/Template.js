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
        SYSTEM
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
        serviceType:SERVICE_TYPE
        portal:PORTAL_TYPE
        type:TEMPLATE_TYPE
    }

    input CreateTemplateInput{
        subject:String!
        message:String!
        portal:PORTAL_TYPE!
        serviceType:SERVICE_TYPE!
    }
    input UpdateTemplateInput{
        id:Int!
        subject:String!
        message:String!
        serviceType:SERVICE_TYPE!
        portal:PORTAL_TYPE!
    }


    extend type Query{
        getAllTemplate:[Template]
        getTemplateById(id:Int!):Template
        getAllTemplateByType(type:String!):[Template]
        getAllTemplateByPortal(portal:String!):[Template]
    }

    extend type Mutation{
        createTemplateBySuperAdmin(input:CreateTemplateInput!):TemplateMutationResponse
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
    },
	
	Mutation:{
		createTemplateBySuperAdmin: async(_,{input},{user})=>{

            const [template, created] = await Template.findOrCreate({where:{serviceType:input.serviceType}, defaults:input})
			if(created){
                return{
                    message:"Template is saved",
                    status:true,
                    template
                }
            }
            return{
                message:"Template already exist for type",
                status:false
            }
		},
		createTemplate: async(_,{input},{user})=>{
			 if(!user){
                return{
                    message:"Access Denied! You are not authorized to access this resource",
                    status:false
                }
            }

            const [template, created] = await Template.findOrCreate({where:{serviceType:input.serviceType}, defaults:input})
			if(created){
                return{
                    message:"Template is saved",
                    status:true,
                    template
                }
            }
            return{
                message:"Template already exist for type",
                status:false
            }
		},

        updateTemplate: async(_,{input},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to access this resource",
                    status:false
                }
            }

            const [updated] = await Template.update(input,{where:{id:input.id}})
            if(updated){
                return{
                    message:"Template update",
                    status:true
                }
            }
            return{
                message:"An error occured",
                status:false
            }
        }
		
	}
}

module.exports = {templateTypes, templateResolvers}