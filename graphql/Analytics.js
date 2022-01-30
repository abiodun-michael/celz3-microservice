const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Group = require("../database/Group")
const Church = require("../database/Church")
const Cell = require("../database/Cell")
const Member = require("../database/Member")



const analyticsTypes = gql`

    

    type Analytics{
        churchCount:Int
        groupCount:Int
        cellCount:Int
        memberCount:Int
    }

  input AnanlyticsPeriod{
      month:Int
      year:Int
  }

    extend type Query{
        getAnalyticsByPeriod(input:AnanlyticsPeriod):Analytics
        
    }

   
`


const analyticsResolvers = {
    Query:{
        getAnalyticsByPeriod: async(_,{input},{user})=>{
           if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           const churchCount = await Church.count()
           const groupCount = await Group.count()
           const cellCount = await Cell.count()
           const memberCount = await Member.count()
           return{
               churchCount,
               groupCount,
               cellCount,
               memberCount
           }
       }
    }
}

module.exports = {analyticsTypes, analyticsResolvers}