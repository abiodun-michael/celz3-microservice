const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {analyticsTypes, analyticsResolvers} = require("./Analytics")



const types = [
  analyticsTypes
  ];
  
const resolvers = [
  analyticsResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};