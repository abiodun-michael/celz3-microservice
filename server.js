require('dotenv').config()
const express = require("express")
const cors = require("cors")
const { ApolloServer } = require("apollo-server-express")
const {typeDefs, resolvers} = require('./graphql/index')
const { buildSubgraphSchema } = require('@apollo/subgraph')
// const subscriptions = require('./util/subscriptions')
const app = express();
const httpServer = require("https").createServer(app);
const {Server} = require("socket.io")

const io = new Server(httpServer,{
  cors:{
    origin: ["https://localhost:3000"],
    credentials: true
  }
})


io.on('connection', (socket) => {
  console.log("Someone connected")
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});




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
    
    app.listen(PORT,()=>{
    console.log(`Media Service running at http://localhost:${PORT}`)
    })
    
    }

    startApolloServer()