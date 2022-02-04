const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {streamTypes, streamResolvers} = require("./Stream")


const types = [
  streamTypes
  ];
  
const resolvers = [
  streamResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};