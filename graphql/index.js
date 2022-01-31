const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {analyticsTypes, analyticsResolvers} = require("./Analytics")
const {churchTypes, churchResolvers} = require("./Church")
const {memberTypes, memberResolvers} = require("./Member")
const {groupTypes, groupResolvers} = require("./Group")
const {cellTypes, cellResolvers} = require("./Cell")
const {zoneTypes, zoneResolvers} = require("./Zone")



const types = [
  analyticsTypes,
  churchTypes,
  memberTypes,
  groupTypes,
  cellTypes,
  zoneTypes
  ];
  
const resolvers = [
  analyticsResolvers,
  churchResolvers,
  memberResolvers,
  groupResolvers,
  cellResolvers,
  zoneResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};