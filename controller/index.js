require("dotenv").config()
const Template = require('../database/Templates')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_KEY)


const replaceStr = (str, payload)=>{
    return str?.replace(/{{([^{{}}]*)}}/g, (_, p)=>{
        return payload[p]
    })
}

const handleSend = async(to, from, subject, message)=>{
        try {
            await sgMail.send({
                from,
                to,
                subject,
                text:message
            });
          } catch (error) {
            console.error(error);
            if (error.response) {
              console.error(error.response.body)
            }
          }
    }

const adminOnboarding = async(payload)=>{
 
 const template = await Template.findOne({where:{serviceType:"ADMIN_ONBOARDING"}})

 if(template){
    payload.link = process.env.BASE_URL+'/verify/'+payload?.token
    const message = replaceStr(template.message,payload)
    handleSend(payload.email,{email:"noreply@sarlexinconcept.com", name:"Sarlexin Concept"},template.subject,message)
 }

}


const adminResetPassword = async(payload)=>{
 
 const template = await Template.findOne({where:{serviceType:"ADMIN_PASSWORD_RESET"}})

 if(template){
    payload.link = process.env.BASE_URL+'/verify/'+payload?.token
    const message = replaceStr(template.message,payload)
    adminAdminResetPassword(payload.email,{email:"noreply@sarlexinconcept.com", name:"Sarlexin Concept"},template.subject,message)
 }

}


const adminRevoke = async(payload)=>{
 
  const template = await Template.findOne({where:{serviceType:"ADMIN_ACCOUNT_REVOKE"}})
 
  if(template){
     payload.link = process.env.BASE_URL+'/verify/'+payload?.token
     const message = replaceStr(template.message,payload)
     adminAdminResetPassword(payload.email,{email:"noreply@sarlexinconcept.com", name:"Sarlexin Concept"},template.subject,message)
  }
 
 }

module.exports = {adminOnboarding,adminResetPassword, adminRevoke}