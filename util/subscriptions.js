const redis = require('./redisConnection')
const {adminOnboarding, adminResetPassword, adminRevoke} = require('../controller')


const subscriptions = ()=>{

    redis.subscribe("messaging",(err, count)=>{
        // log counts
       
    })
    redis.on("message",(channel, message)=>{
        
        const payload = JSON.parse(message)

        if(payload.operation == "account_creation"){
            adminOnboarding(payload)
        }

        if(payload.operation == "password_reset"){
            adminResetPassword(payload)
        }

        if(payload.operation == "account_revocation"){
            adminRevoke(payload)
        }


    })

}

module.exports = subscriptions