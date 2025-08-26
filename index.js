
import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import types from "./config/typeDefs.js";
import resolvers from "./config/resolvers.js";
import connectDB from "./config/db.js";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import jwt from "jsonwebtoken"
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from "passport";
import configurePassport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import session from 'express-session';
import User from "./models/User.js";
console.log(process.env.NODE_ENV)




// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
 

  // Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Ensure we wait for our server to start
await connectDB();


// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'development' }
  })
);
// Passport middleware
configurePassport();
app.use(passport.initialize());

// Routes for OAuth
app.use('/auth', authRoutes);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:3000',
  credentials: true
}));

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  typeDefs: types, 
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
// Apply middleware
app.use(
  '/',
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      // Get the token from the request headers
      const token = req.headers.authorization ? 
        req.headers.authorization.split(" ")[1] : null;
      
      // If there's a token, verify it and get the user
      let user = null;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
          user = await User.findById(decoded.id);
        } catch (error) {
          console.error("Token verification failed:", error.message);
        }
      }
      
      return { req, user };
    },
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);

