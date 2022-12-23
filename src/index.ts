import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import { libraries, agent, books, state } from "./data";
import {
	parseResolveInfo,
	simplifyParsedResolveInfoFragmentWithType
} from 'graphql-parse-resolve-info';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

interface MyContext {
  token?: String;
}

const libraries = [
  {
    branch: 'downtown',
  },
  {
    branch: 'riverside',
  },
];

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown',
  },
];

const agent = [
  {
    name: 'Adam Score',
    state: 'LA'
  },
  {
    name: 'Levine Sclutz',
    state: 'Las Vegas'
  },
];

const state = [
  {
    name: 'LA'
  },
  {
    name: 'Las Vegas'
  },
  {
    name: 'Auston'
  },
]

// Schema definition
const typeDefs = `#graphql
  type Library {
    branch: String!
    books: [Book!]
  }

  type Book {
    title: String!
    author: Author!
  }

  type Author {
    name: String!
  }

  type Agent {
    name: String
    state: [State!]
  }

  type State {
    state: String!
  }

  type Query {
    libraries: [Library]
    agent: [Agent]
  }
`;


const resolvers = {
    Query: {
      libraries(){
        // const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        // const { fields } = simplifyParsedResolveInfoFragmentWithType(
        //   parsedResolveInfoFragment,
        //   Library
        // );
        return libraries;
      },
      agent(){
        return agent;
      }
    },
    Library: {
      books(parent, args, context, info) {
        console.log(info);
        // console.log(JSON.stringify(info))
        // const parsedResolveInfoFragment = parseResolveInfo(info);
        return books.filter((book) => book.branch == parent.branch);
      },
    },
    Book: {
      author(parent){
        return {
          name: parent.author
        } 
      }
    },
    Agent: {
      state(parent, args, context, info){
        console.log(info);
        // console.log("resolver 1");
        // console.log(info,'infoo')
        return agent.filter((agen) => agen.state === parent.state);
      }
    }
  };


async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use('/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/`);
}

startApolloServer()
