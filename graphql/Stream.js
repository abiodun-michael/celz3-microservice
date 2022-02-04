require("dotenv").config()
const {gql} = require("apollo-server")
const Stream = require("../database/Stream")
const axios = require("axios")
const Output = require("../database/Output")

const APP_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const ENDPOINT = process.env.CLOUDFLARE_ENDPOINT
const TOKEN = process.env.CLOUDFLARE_TOKEN

const streamTypes = gql`

    enum STREAM_OWNER_TYPE{
        ZONE
        GROUP
        CHURCH
        CELL
    }

    enum STREAM_RECORDING_MODE{
        OFF
        AUTOMATIC
    }

    type StreamMutationResponse{
        message:String
        status:Boolean
        stream:Stream
    }

    type Output{
        id:Int
        name:String
        url:String
        streamKey:String
    }

    type Stream @key(fields:"id"){
        id:Int
        name:String
        streamId:String
        rtmpsUrl:String
        rtmpsStreamKey:String
        recordingMode:STREAM_RECORDING_MODE
        ownerType:STREAM_OWNER_TYPE
        createdAt:String
        createdBy:Int
        output:[Output]
    }

    type Live{
        videoId:String
        duration:Float
        readyToStream:Boolean
    }

    type Video{
        id:String
        live:Boolean
        isInput:Boolean
    }

    input CreateStreamInput{
        name:String!
        ownerType:STREAM_OWNER_TYPE!
        zoneId:Int!
        groupId:Int
        churchId:Int
    }

    input CreateOutputInput{
        name:String!
        url:String!
        streamKey:String!
        streamId:Int!
    }

    input UpdateStreamInput{
        id:Int!
        name:String!
        ownerType:STREAM_OWNER_TYPE!
        zoneId:Int!
        groupId:Int
        churchId:Int
    }

    extend type Query{
        getAllStreamByZone:[Stream]
        getAllStreamByGroupId(id:Int!):[Stream]
        getStreamById(id:Int!):Stream
        getLiveStreamByStreamId(id:String!):Live
        getLiveVideoIdByStreamId(id:String!):Video
    }

    extend type Mutation{
        createStream(input:CreateStreamInput!):StreamMutationResponse
        updateStream(input:UpdateStreamInput!):StreamMutationResponse
        deleteStream(id:Int!):StreamMutationResponse
        toggleStreamRecording(id:Int!):StreamMutationResponse
        createOutput(input:CreateOutputInput!):StreamMutationResponse
        toggleOutput(id:Int!):StreamMutationResponse
    }
`


const streamResolvers = {
    Query:{
        getAllStreamByZone: async(_,__,{user})=>{
        //    if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Stream.findAll()
       },
       getStreamById: async(_,{id},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           return await Stream.findOne({where:{id}})
       },
       getLiveStreamByStreamId:async(_,{id})=>{
      

            const {data} = await axios({
                method:"get",
                url:ENDPOINT+`accounts/${APP_ID}/stream/live_inputs/${id}/videos`,
                headers:{
                    Authorization:`Bearer ${TOKEN}`
                }
            }) 

            if(data){
                const respo = data?.result
                const {readyToStream,duration,playback} = respo[respo.length - 1] || {}

                return{
                    readyToStream,
                    duration,
                    hlsUrl: playback?.hls
                }
            }
       },
       getLiveVideoIdByStreamId:async(_,{id})=>{
      

            const {data} = await axios({
                method:"get",
                url:`https://videodelivery.net/${id}/lifecycle`
            }) 

            if(data){
  
                const {videoUID,live,inInput} = data?.result

                return{
                    id:videoUID,
                    live,
                    inInput
                }
            }
       }
    },
    Stream:{
        output: async({id})=>await Output.findAll({where:{streamId:id}})
    },
    Mutation:{
        createStream: async(_,{input},{user})=>{
            // if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           
            const {data} = await axios({
                method:"post",
                url:ENDPOINT+`accounts/${APP_ID}/stream/live_inputs`,
                data:{
                    meta:{
                        name:input.name
                    },
                    recording:{
                        mode:"automatic",
                        allowedOrigins:["localhost","celz3.com"]
                    }
                },
                headers:{
                    Authorization:`Bearer ${TOKEN}`
                }
            })

            if(data){
                input.createdBy = user?.id || 0
                const {uid,rtmps} = data?.result || {}
                const stream = await Stream.create({...input,streamId:uid, rtmpsUrl:rtmps?.url,rtmpsStreamKey:rtmps?.streamKey})
                if(stream){
                    return{
                        message:"Stream created",
                        status:true
                    }
                }
                return{
                    message:"An error occured",
                    status:false
                }
            }
       
        },
        deleteStream: async(_,{id},{user})=>{

            const stream = await Stream.findOne({id})

            if(stream){
                const {data} = await axios({
                    method:"delete",
                    url:ENDPOINT+`accounts/${APP_ID}/stream/live_inputs/${stream?.streamId}`,
                    data:{
                        meta:{
                            name:input.name
                        },
                        recording:{
                            mode:"automatic",
                            allowedOrigins:["localhost","celz3.com"]
                        }
                    },
                    headers:{
                        Authorization:`Bearer ${TOKEN}`
                    }
                }) 

                if(data){
                    return{
                        message:"Stream has been deleted",
                        status:true
                    }
                }

            }
            return{
                message:"Stream does not exist",
                status:false
            }
        },
        toggleStreamRecording: async(_,{id})=>{
            const stream = await Stream.findOne({where:{id}})
            if(stream){
                const recordingMode = stream?.recordingMode == "OFF" ? "automatic":"off"
                const {data} = await axios({
                    method:"put",
                    url:ENDPOINT+`accounts/${APP_ID}/stream/live_inputs/${stream?.streamId}`,
                    data:{
                        recording:{
                            mode:recordingMode,
                        }
                    },
                    headers:{
                        Authorization:`Bearer ${TOKEN}`
                    }
                }) 

                await Stream.update({recordingMode: stream?.recordingMode == "OFF" ? "AUTOMATIC":"OFF"})
                return{
                    message: recordingMode == "off"? "Recording stopped":"Recording started",
                    status:true
                }
            }
        },
       
        createOutput:async(_,{input})=>{
            const [__, created] = await Output.findOrCreate({where:{streamId:input.streamId,url:input.url,streamId:input.streamKey},defaults:input})
            if(created){
                return{
                    message:"Output added to stream",
                    status:true
                }
            }
            return{
                message:"Output already exist for stream",
                status:false
            }
        },
        toggleOutput: async(_,{id},{user})=>{

            const {url,streamKey,streamId,status,outputId} = await Output.findOne({where:{id}}) || {}

                if(!status){
                    const {data} = await axios({
                        method:"post",
                        url:ENDPOINT+`accounts/${APP_ID}/stream/live_inputs/${streamId}/outputs`,
                        data:{
                           url,
                           streamKey
                        },
                        headers:{
                            Authorization:`Bearer ${TOKEN}`
                        }
                    }) 

                    await Output.update({status:true,outputId:data?.result?.uid},{where:{id}})

                    return{
                        message:"Output activated",
                        status:true
                    }
                }

                const {data} = await axios({
                    method:"delete",
                    url:ENDPOINT+`accounts/${APP_ID}/stream/live_inputs/${streamId}/outputs/${outputId}`,
                    headers:{
                        Authorization:`Bearer ${TOKEN}`
                    }
                }) 

                return{
                    message:"Output deactivated",
                    status:true
                }
            
        }
    }
}

module.exports = {streamTypes, streamResolvers}