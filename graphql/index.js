const { mergeTypeDefs,mergeResolvers  } = require('@graphql-tools/merge')
const {templateTypes, templateResolvers} = require("./Template")


const types = [
  templateTypes
  ];
  
const resolvers = [
  templateResolvers
];
    

module.exports = {typeDefs:mergeTypeDefs(types), resolvers: mergeResolvers(resolvers)};