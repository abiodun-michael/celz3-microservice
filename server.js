require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { ApolloServer } = require("apollo-server-express")
const {typeDefs, resolvers} = require('./graphql/index')
const { buildSubgraphSchema } = require('@apollo/subgraph')
// const subscriptions = require('./util/subscriptions')
const app = express();
const {Server} = require("socket.io")






const PORT = process.env.PORT || 4001



    const startApolloServer = async()=>{
      app.use(cors())
     
      app.use(express.json({limit:'50MB'}))

    
    const server = new ApolloServer({ 
      schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
      context:({req,res})=>{
      
        if(req.headers?.user && req.headers?.user != 'undefined'){
         const user = JSON.parse(req.headers.user)
          return{user,req,res}
        }else{
         return{req,res}
        }
      
      }
     })
    
    await server.start()
    
    server.applyMiddleware({app,cors:false})
    
    const appServer = app.listen(PORT,()=>{
    console.log(`Media Service running at http://localhost:${PORT}`)
    })


    const io = new Server(appServer,{
      cors:{
        origin: ["https://localhost:3000"],
        credentials: true
      }
    })
    
    }

    startApolloServer()