require('dotenv').config()
const {typeDefs, resolvers} = require('./graphql/index')
const { ApolloServer } = require("apollo-server")
const { buildSubgraphSchema } = require('@apollo/subgraph')



const PORT = process.env.PORT || 4001





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
  
  
    server.listen(PORT,()=>{
      console.log(`Auth Service running at http://localhost:${PORT}`)
    })
