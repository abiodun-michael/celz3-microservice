const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {analyticsTypes, analyticsResolvers} = require("./Analytics")
const {churchTypes, churchResolvers} = require("./Church")
const {memberTypes, memberResolvers} = require("./Member")
const {groupTypes, groupResolvers} = require("./Group")
const {cellTypes, cellResolvers} = require("./Cell")
const {zoneTypes, zoneResolvers} = require("./Zone")
const {programTypes, programResolvers} = require("./Program")



const types = [
  analyticsTypes,
  churchTypes,
  memberTypes,
  groupTypes,
  cellTypes,
  zoneTypes,
  programTypes
  ];
  
const resolvers = [
  analyticsResolvers,
  churchResolvers,
  memberResolvers,
  groupResolvers,
  cellResolvers,
  zoneResolvers,
  programResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};