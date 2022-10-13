// Schema definition
export const typeDefs = `#graphql
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
