const {gql} = require("apollo-server")
const Zone = require("../database/Zone")
const Group = require("../database/Group")
const Church = require("../database/Church")
const Cell = require("../database/Cell")
const Member = require("../database/Member")
const sequelize = require("../database/connection")
const {Op,QueryTypes} = require('sequelize')


const analyticsTypes = gql`

    

    type Analytics{
        churchCount:Int
        groupCount:Int
        cellCount:Int
        memberCount:Int
        chart:[Chart]
    }

    type Chart{
        groupName:String
        previousCount:Int
        currentCount:Int
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
        //    if(!user) return{message:"Access Denied! You are not authorized to view this resource", status:false}
           const churchCount = await Church.count()
           const groupCount = await Group.count()
           const cellCount = await Cell.count()
           const memberCount = await Member.count()
            const month = new Date().getMonth()
           const chart = await sequelize.query("SELECT `members`.`groupId`, groups.name, COUNT(*) as count FROM members LEFT JOIN groups ON members.groupId = groups.id WHERE members.createdAt BETWEEN  DATE_ADD(members.createdAt,INTERVAL -2 MONTH) AND NOW() GROUP BY members.groupId",{ type: QueryTypes.SELECT })
           
          
             return{
               churchCount,
               groupCount,
               cellCount,
               memberCount,
                chart
           }
       }
    }
}

module.exports = {analyticsTypes, analyticsResolvers}