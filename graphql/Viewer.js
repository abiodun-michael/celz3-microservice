const {gql} = require("apollo-server")
const Viewer = require("../database/Viewers")


const viewerTypes = gql`

    type ViewerMutationResponse{
        message:String
        status:Boolean
        viewer:Viewer
    }

    type Viewer {
        id:Int
        name:String
        phone:String
        email:String
    }

    input CreateViewerInput{
        name:String!
        phone:String!
        email:String
    }

   

    extend type Query{
        getAllViewer:[Viewer]
        getViewerByStreamId(id:Int!):[Viewer]
        getViewerById(id:Int!):Viewer
    }

    extend type Mutation{
        createViewer(input:CreateViewerInput!):ViewerMutationResponse
    }
`


const viewerResolvers = {
    Query:{
        getAllViewer: async(_,__,{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Viewer.findAll()
       },
       getViewerByStreamId: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Viewer.findOne({where:{id}})
       },

       getViewerById: async(_,{id})=>{
           return await Viewer.findOne({where:{id}})
       }
    },

    Mutation:{
        createViewer: async(_,{input})=>{
           const [viewer, created] = await Viewer.findOrCreate({where:{phone:input.phone}, defaults:input})
            
           if(created){
               return{
                   message:"Account created",
                   status:true,
                   viewer
               }
           }else{
               const viewers = await Viewer.findOne({where:{phone:input.phone}})
               return{
                message:"You already have an account",
                status:true,
                viewer:viewers
            }
            }
           
        }
    }
}

module.exports = {viewerTypes, viewerResolvers}