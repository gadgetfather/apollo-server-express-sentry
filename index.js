const express = require('express');
const Sentry = require('@sentry/node');
const { ApolloServer, gql, ApolloError } = require('apollo-server-express');
Sentry.init({
    dsn: "https://263de62b20f90f49261d7e85d82ae83b@o4506615275716608.ingest.sentry.io/4506615277027328",
    integrations: [],
  });
  
  // The request handler must be the first middleware on the app


// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    myQuery: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    myQuery: () => {throw new ApolloError('Error message yo', 500);}
  },
};

const app = express();
app.use(Sentry.Handlers.requestHandler());

// Custom middleware that logs "hello"
app.use((req, res, next) => {
  console.log('hello');
  next();
});

async function startApolloServer(typeDefs, resolvers) {
    const server = new ApolloServer({ typeDefs, resolvers,formatError: (err) => {
        console.log("99999999",err);
        Sentry.captureException(err);
        return err;

    } });
    
    // Start the Apollo Server
    await server.start();
  
    // Apply the Apollo Server middleware
    server.applyMiddleware({ app });
    app.use(Sentry.Handlers.errorHandler()); // Sentry error handler

  
    // Start the Express server
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  }
  
  startApolloServer(typeDefs, resolvers);
