const redis = require('./redisConnection')
const {adminOnboarding, adminResetPassword, adminRevoke} = require('../controller')


const subscriptions = ()=>{

    redis.subscribe("messaging",(err, count)=>{
        // log counts
        console.log(count)
    })
    redis.on("message",(channel, message)=>{
        
        const payload = JSON.parse(message)

        if(payload.operation == "account_creation"){
            adminOnboarding(payload.dataValues)
        }

        if(payload.operation == "password_reset"){
            adminResetPassword(payload.dataValues)
        }

        if(payload.operation == "account_revocation"){
            adminRevoke(payload.dataValues)
        }


    })

}

module.exports = subscriptions