require('dotenv').config()
const {typeDefs, resolvers} = require('./graphql/index')
const { ApolloServer } = require("apollo-server")
const { buildSubgraphSchema } = require('@apollo/subgraph')
// const subscriptions = require('./util/subscriptions')



const PORT = process.env.PORT || 4002





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
  
    // subscriptions()
    server.listen(PORT,()=>{
      console.log(`Auth Service running at http://localhost:${PORT}`)
    })
