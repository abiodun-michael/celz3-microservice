require('dotenv').config()
const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const { ApolloGateway,RemoteGraphQLDataSource } = require('@apollo/gateway');
const cookieParser = require("cookie-parser")
const cors = require('cors')
const redis = require('./util/redisConnection');
const { send_command } = require('./util/redisConnection');
const {Server} = require("socket.io")



const PORT = process.env.PORT || 5000

let allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  "https://www.celz3.com",
  'https://studio.apollographql.com',
  'https://zone-landing-celz3.herokuapp.com',
]



const startApolloServer = async()=>{
 
  const app = express();
  app.use(express.json({limit:'50MB'}))
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
  subscription:false,
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
          request.http?.headers.set("user", context.user);
      },
      async didReceiveResponse({ response, request, context }) {
      
        const uuid = response.http.headers.get('uuid');
    
           if(uuid){
              context.uuid = uuid
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
    return { user,res }
  },
  plugins: [
    {
      requestDidStart() {
        return {
          willSendResponse({context, res}) {
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

const appServer = app.listen(PORT,()=>{
console.log(`Auth Service running at http://localhost:${PORT}`)
})

const io = new Server(appServer,{
  cors:{
    origin: ["https://localhost:3000"],
    credentials: true
  }
})

}


startApolloServer()
