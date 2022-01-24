const redis = require("./util/redisConnection")

redis.subscribe("messaging",(err,count)=>{
    console.log(count)

    redis.on("message",(channel, message)=>{
        console.log(channel, message)
    })
})