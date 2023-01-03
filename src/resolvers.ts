import { libraries, agent, books, state } from "./data";
import {
	parseResolveInfo,
	simplifyParsedResolveInfoFragmentWithType
} from 'graphql-parse-resolve-info';

export const resolvers = {
    Query: {
      libraries: (resolveInfo) => {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        // const { fields } = simplifyParsedResolveInfoFragmentWithType(
        //   parsedResolveInfoFragment,
        //   Library
        // );
        console.log(resolveInfo);
        console.log(parsedResolveInfoFragment);
        return libraries;
      },
      agent(){
        return agent;
      }
    },
    Library: {
      books(parent) {
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
      state(parent){
        console.log("resolver 1")
        return agent.filter((agen) => agen.state === parent.state);
      }
    }
  };
