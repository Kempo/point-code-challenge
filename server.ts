import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { resolvers } from './src/resolvers';
import { typeDefs } from './src/schema';
import { authenticate } from './src/services/auth';

async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({ req }) => {
      // Passes user details (parsed from the request) down into the context.
      // If user isn't properly authenticated, we can use this
      // field within our resolvers to check.
      return {
        user: req.user
      }
    }
  });

  await server.start();

  // Authenticate and verify each request to determine whether or not
  // the current request is a valid user.
  app.use('/', authenticate);

  server.applyMiddleware({ app, path: '/' });

  await new Promise(resolve => (app.listen({ port: 4000 }), resolve(true)));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();