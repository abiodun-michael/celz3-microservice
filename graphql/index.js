const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {memberTypes, memberResolvers} = require("./Member")
const {zoneTypes, zoneResolvers} = require("./Zone")
const {groupTypes, groupResolvers} = require("./Group")
const {churchTypes, churchResolvers} = require("./Church")
const {cellTypes, cellResolvers} = require("./Cell")


const types = [
  memberTypes,
  zoneTypes,
  groupTypes,
  churchTypes,
  cellTypes
  ];
  
const resolvers = [
  memberResolvers,
  zoneResolvers,
  groupResolvers,
  churchResolvers,
  cellResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};