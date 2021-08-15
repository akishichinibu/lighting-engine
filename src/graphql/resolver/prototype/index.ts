import "reflect-metadata";
import { Resolver, Query, Arg, FieldResolver, Root, Mutation, Subscription } from "type-graphql";

import { TOPIC_PROTOTYPE_PUBLISH } from "../topics";

import ProtoType from "@src/model/container/prototype";
import * as load from "@src/events/prototype/load";
import { buildRequester } from "@src/events/rr";


const loadProtoTypeRequester = buildRequester<load.RequestPayload, load.ResponsePayload>(load.ACTION_LOAD_PROTOTYPE);


@Resolver(ProtoType)
class ProtoTypeResolver {

  // constructor(
  //   private accessor: ModelGitAccssor,
  // ) {}

  // @Query(() => [ProtoType])
  // async protoTypes() {
  //   return await ProtoType.all();
  // }

  @Query(() => ProtoType)
  async protoType(@Arg("name") name: string): Promise<ProtoType> {
    const payload = await loadProtoTypeRequester({ name });
    return payload.protoType;
  }

  @FieldResolver(() => Date)
  async created_at(@Root() protoType: ProtoType) {
    return new Date();
  }

  @FieldResolver(() => Date)
  async updated_at(@Root() protoType: ProtoType) {
    return new Date();
  }

  @FieldResolver(() => String)
  async template(@Root() protoType: ProtoType): Promise<string> {
    const payload = await loadProtoTypeRequester({ name: protoType.name });
    return payload.template;
  }

  // @Mutation(() => ProtoType)
  // async updateProtoType(
  //   @Arg("name", () => String) name: string,
  //   @Arg("content", () => UpdateProtoTypeInput) content: UpdateProtoTypeInput,
  // ) {
  //   let model;

  //   try {
  //     model = await ProtoType.load(name)
  //   } catch (error) {
  //     model = new ProtoType(name, "", [], []);
  //   }

  //   if (content.description !== undefined) {
  //     model.description = content.description;
  //   }

  //   if (content.sections) {
  //     const id2Sections = new Map(model.sections.map(r => [r.id, r]));

  //     for (let s of content.sections) {
  //       let section;

  //       if (s.id) {
  //         section = id2Sections.get(s.id);
  //         if (!section) {
  //           throw new Error(`The section with id [${s.id}] does not exist. `);
  //         }
  //       } else {
  //         if (!s.name) {
  //           throw new Error(`The id of the section was not given, so that the name will be necessary. `);
  //         }
  //         section = new Section(s.name, []);
  //       }

  //       if (s.fields) {
  //         const id2Fields = new Map(section.fields.map(r => [r.id, r]));

  //         for (let f of s.fields) {
  //           let field;

  //           if (f.id) {
  //             field = id2Fields.get(f.id);
  //             if (!field) {
  //               throw new Error(`The field with id [${f.id}] in section [${s.id}] does not exist. `);
  //             }
  //           } else {
  //             if (!f.name) {
  //               throw new Error(`The id of the field was not given, so that the name will be necessary. `);
  //             }
  //             if (!f.allowEdit) {
  //               throw new Error(`The id of the field was not given, so that the allowEdit will be necessary. `);
  //             }
  //             field = new FieldBase(f.name, f.description, f.allowEdit, f.properties || []);
  //           }
  //         }
  //       }
  //     }
  //   }

  //   console.log(model.serialize());

  //   model.dump();
  //   return model;
  // }

  @Subscription(() => ProtoType, {
    topics: ({ args }) => `${TOPIC_PROTOTYPE_PUBLISH}-${args.name}`,
  })
  async protoTypeNotification(@Arg("name") name: string) {
    return await this.protoType(name);
  }

}


export default ProtoTypeResolver;
