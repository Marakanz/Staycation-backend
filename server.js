import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import types from "./config/typeDefs.js";
import resolvers from "./config/resolvers.js";
 
const server = new ApolloServer({
  typeDefs: types,
  resolvers,
})
 
const { url } = await startStandaloneServer(server)
 
console.log(`🚀 Server ready at ${url}`)