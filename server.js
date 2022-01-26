require('dotenv').config()
const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const { ApolloGateway,RemoteGraphQLDataSource  } = require('@apollo/gateway');
const cookieParser = require("cookie-parser")
const cors = require('cors')
const redis = require('./util/redisConnection')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 5000

let allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://studio.apollographql.com',
]



const startApolloServer = async()=>{
 
  const app = express();
  app.use(express.json({limit:'1000MB'}))
  app.use(cookieParser())
 
  
  app.use(cors({origin:(origin, callback)=>{
    
    if(!origin) return callback(null, true)

    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
},credentials:true}))





const gateway = new ApolloGateway({
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
          request.http?.headers.set("user", context.user);
      },
      async didReceiveResponse({ response, request, context }) {
      
          const {loginAdmin} = response?.data || {}
     
          if(loginAdmin && loginAdmin.status){
            const uuid = loginAdmin?.admin?.id+"."+uuidv4()
              redis.set(uuid, JSON.stringify(loginAdmin?.admin))
              context.uuid
          }
        return response;
      }
  });
  }
});

const server = new ApolloServer({ 
  gateway,
  context: async({ req,res }) => {
    const {lz3_uuid} = req.cookies || {}
    let user = null
    if(lz3_uuid){
      user = await redis.get(lz3_uuid)
    }
    return { user }
  },
  plugins: [
    {
      requestDidStart() {
        return {
          willSendResponse({context}) {
            if(context.uuid){
              context.res.cookie("lz3_uuid",context.uuid,{sameSite:'none', secure:true, httpOnly:true})
            }
          }
        };
      }
    }
  ]
})

await server.start()

server.applyMiddleware({app,cors:false})

app.listen(PORT,()=>{
console.log(`Auth Service running at http://localhost:${PORT}`)
})

}


startApolloServer()
