const {gql} = require('apollo-server')
const Admin = require('../database/Admin')
const Token = require('../database/Token')
const RevocationNote = require('../database/RevocationNote')
const jwt = require('jsonwebtoken')
const redis = require('../util/redisConnection')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const adminTypes = gql`

enum PERMISSION_TYPE{
    SYSTEM
    CHURCH_MINISTRY
    CELL_MINISTRY
    FINANCE
    PARTNERSHIP
    MEDIA
    FOUNDATION_SCHOOL
    CELL_LEADER
}

enum PORTAL_ACCESS_TYPE{
    SYSTEM
    ZONE
    GROUP
    CHURCH
    CELL
    }

    enum ROLE_TYPE{
        SYSTEM
        ADMIN
        EDITOR
        VIEWER
    }

    type AdminMutationResponse{
        message:String
        status:Boolean
        admin:Admin
    }

    type Admin @key(fields:"id"){
        id:Int
        fullName:String
        phone:String
        photoUrl:String
        email:String
        profile:String
        portalAccess:PORTAL_ACCESS_TYPE
        permissions:PERMISSION_TYPE
        role:ROLE_TYPE
        status:Boolean
        lastSeen:String
        churchId:Int
        groupId:Int
        zoneId:Int
        cellId:Int
    }


    input CreateAdminInput{
        fullName:String!
        phone:String!
        email:String!
        profileId:Int
        churchId:Int
        groupId:Int
        zoneId:Int
        cellId:Int
        portalAccess:PORTAL_ACCESS_TYPE!
        permissions:PERMISSION_TYPE!
        role:ROLE_TYPE!
    }

    
    input UpdateAdminInput{
        id:Int!
        fullName:String!
        phone:String!
        email:String!
        profileId:Int
        churchId:Int
        groupId:Int
        cellId:Int
        portalAccess:PORTAL_ACCESS_TYPE!
        permissions:PERMISSION_TYPE!
        role:ROLE_TYPE!
    }


    input LoginAdminInput{
        email:String!
        password:String!
    }

    input RevokeAdminInput{
        id:String!
        reason:String!
    }

    input AdminSetPasswordInput{
        id:Int!
        password:String!
    }

    type Query{
        getAllAdmin:[Admin]
        getAdminByChurchId(id:Int!):[Admin]
        getAdminByGroupId(id:Int!):[Admin]
        getAdminByCellId(id:Int!):[Admin]
        getMyProfile:Admin
        verifyEmail(token:String!):AdminMutationResponse
    }

   type Mutation{
       uploadAvatar(file:Upload!):AdminMutationResponse
        inviteAdminBySuperAdmin(input:CreateAdminInput):AdminMutationResponse
        inviteAdmin(input:CreateAdminInput):AdminMutationResponse
        updateAdmin(input:UpdateAdminInput):AdminMutationResponse
        revokeAdmin(input:RevokeAdminInput):AdminMutationResponse
        resetAdminPassword(id:Int!):AdminMutationResponse
        loginAdmin(input:LoginAdminInput!):AdminMutationResponse
        updateMyProfile(input:UpdateAdminInput):AdminMutationResponse
        setPassword(input:AdminSetPasswordInput!):AdminMutationResponse
    }
`


const adminResolvers = {
    Upload: GraphQLUpload,

    Query:{
        getMyProfile: async(_,__,{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            return await Admin.findOne({where:{id:user.id}})
        },
        getAllAdmin: async(_,__,{user})=>{
            if(!user || !["SYSTEM","ZONAL"].includes(user.portalAccess)){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            return await Admin.findAll({where:{portalAccess:"SYSTEM"}})
           
        },
        getAdminByChurchId: async(_,{id},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            return await Admin.findAll({where:{churchId:id}})
        },
        getAdminByGroupId: async(_,{id},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            return await Admin.findAll({where:{groupId:id}})
        },
        getAdminByCellId: async(_,{id},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            return await Admin.findAll({where:{cellId:id}})
        },
		verifyEmail: async(_,{token})=>{
            const myToken = await Token.findOne({where:{ott:token}})

            if(myToken){
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
                const [admin] = await Admin.update({isAcceptInvite:true, status:true},{where:{id:decodedToken.id}})
                if(admin){
                    await Token.destroy({where:{ott:token}})
                    return{
                        message:"Account verified, now set your password",
                        status:true,
                        admin:{id:decodedToken.id}
                    }
                }
                return{
                    message:"Invalid verification link",
                    status:false
                }
            }

            return{
                message:"Invalid verification link",
                status:false
            }
        },
    },

    Program:{
        __resolveReference({id}) {
            return async()=> await Admin.findOne({where:{id}})
          }
    },
    Mutation:{
        inviteAdminBySuperAdmin: async(_,{input})=>{
            input.invitedBy = 0
            const [admin, created] = await Admin.findOrCreate({where:{email:input.email}, defaults:input})
            if(created){
                const token = jwt.sign({id:admin.id}, process.env.JWT_SECRET_KEY)
                await Token.create({ott:token,adminId:admin.id})
                // send token with other info message broker to notification service
                redis.publish("messaging",JSON.stringify({
                    ...admin,
                    token,
                    operation:"account_creation"
                }))
                return{
                    message:"Admin has been invited",
                    status:true,
                    admin
                }
            }
            return{
                message:"Account with email address already exist",
                status:false
            }
        },
        inviteAdmin: async(_,{input},{user})=>{
            if(user?.role !== "SUPER" || user?.role !== "ADMIN"){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }
            input.invitedBy = user.id
            const [admin, created] = await Admin.findOrCreate({where:{email:input.email}, defaults:input})
            if(created){
                const token = jwt.sign({id:admin.id}, process.env.JWT_SECRET_KEY)
                await Token.create({ott:token,adminId:admin.id})
                // send token with other info message broker to notification service
                redis.publish("messaging",JSON.stringify({
                    ...admin,
                    token,
                    operation:"account_creation"
                }))
                return{
                    message:"Admin has been invited",
                    status:true,
                    admin
                }
            }
            return{
                message:"Account with email address already exist",
                status:false
            }
        },
        updateAdmin: async(_,{input},{user})=>{
            if(user?.role !== "SUPER" || user?.role !== "ADMIN"){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            const isUpdated = await Admin.update(input,{where:{id:input.id}})
            if(isUpdated){
                return{
                    message:"Admin info updated",
                    status:true,
                    admin:input
                }
            }
            return{
                message:"An error occured during this operation",
                status:false
            }
        },
        updateMyProfile: async(_,{input},{user})=>{
            if(!user){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            const isUpdated = await Admin.update(input,{where:{id:user.id}})
            if(isUpdated){
                return{
                    message:"Profile info updated",
                    status:true,
                    admin:input
                }
            }
            return{
                message:"An error occured during this operation",
                status:false
            }
        },
        revokeAdmin: async(_,{input},{user})=>{

            const admin = await Admin.findOne({where:{id:input.id}})
            if(admin){
                await RevocationNote.create({...input, invokedBy:user.id})
                await Admin.update({status:false},{where:{id:input.id}})
                redis.publish("messaging",JSON.stringify({
                    ...admin,
                    operation:"account_revocation"
                }))
                return{
                    message:"Account has been revoked",
                    status:true
                }
            }
            return{
                message:"Invalid account",
                status:false
            }
        },
        resetAdminPassword: async(_,{id},{user})=>{
            if(user?.role !== "SUPER" || user?.role !== "ADMIN"){
                return{
                    message:"Access Denied! You are not authorized to perform this operation",
                    status:false
                }
            }

            const admin = await Admin.findOne({where:{id}})

            if(admin){
                await Admin.update({password:""},{where:{id}})
                const token = jwt.sign({id:admin.id}, process.env.JWT_SECRET_KEY)
                await Token.create({token,adminId:admin.id})
                redis.publish("messaging",JSON.stringify({
                    ...admin,
                    token,
                    operation:"password_reset"
                }))
                return{
                    message:"Password has been reset and instruction sent to user email",
                    status:true,
                    admin
                }
            }
            return{
                message:"An error occurred",
                status:false
            }
        },
        loginAdmin: async(_,{input},{res})=>{

            const admin = await Admin.findOne({where:{email:input.email}})
            if(admin){
                if(!admin.status)return{message:"Your account is revoked. Contact the support team", status:false}
                if(admin.password && admin.isAcceptInvite){
                    const isTrue = bcrypt.compareSync(input.password, admin.password)
                    if(isTrue){
                        await Admin.update({lastSeen:new Date()},{where:{email:input.email}})
                        const uuid = admin.id+'_'+uuidv4()
                        redis.set(uuid,JSON.stringify(admin))
                        res.header("uuid", uuid)
                        return{
                            message:"Authentication successful",
                            status:true,
                            admin
                        }
                    }
                    return{
                        message:"Invalid email and password combination",
                        return:false
                    }
                }
                return{
                    message:"You have not set your account password",
                    return:false
                }
            }
            return{
                message:"Invalid email and password combination",
                return:false
            }
            
            
        },

        

        setPassword: async(_,{input})=>{
            const salt = bcrypt.genSaltSync(10);
            input.password = bcrypt.hashSync(input.password, salt);
            const [updated] = await Admin.update({password:input.password}, {where:{id:input.id, isAcceptInvite:true, status:true}})
             if(updated){
                 return{
                     message:"Password is set. Proceed to login",
                     status:true
                 }
             }

             return{
                message:"Invalid operations",
                status:false
            }
        }
    }
}

module.exports = {adminTypes, adminResolvers}