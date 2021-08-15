import "reflect-metadata";

import { Resolver, Query } from "type-graphql";
import GraphQLJSON from 'graphql-type-json';

import accessor from "@store/git/ModelGitAccssor";
import System from "@model/SystemStatus";


@Resolver(System)
class SystemResolver {

  @Query(() => GraphQLJSON)
  async currentBranch() {
    return (await accessor).getCurrentBranch();
  }

}


export default SystemResolver;
