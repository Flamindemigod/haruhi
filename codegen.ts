import { CodegenConfig } from "@graphql-codegen/cli";

const config:CodegenConfig = {
    schema:"https://graphql.anilist.co",
    documents: ["src/**/*.{ts, tsx}", "src/app/graphql/queries.ts"],
    ignoreNoDocuments:true,
    overwrite:true,
    config:{
        avoidOptionals: true,
    },
    generates: {
        "./src/__generated__/": {
            overwrite:true,
            plugins:[{add: {content: "/* THIS IS A GENERATED FILE */"}}, {add: {content: "/* eslint-disable */"}}],
            // plugins:["typescript", "typescript-operations", "typescript-compatibility", ],
            config:{
                strict: true,
            },
            preset: "client",
            presetConfig:{
                gqlTagName: "gql"
            }
        }
    }
};

export default config;



