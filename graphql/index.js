const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {adminTypes, adminResolvers} = require("./Admin")


const types = [
  adminTypes
  ];
  
const resolvers = [
  adminResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};