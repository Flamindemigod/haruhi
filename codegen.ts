import { CodegenConfig } from "@graphql-codegen/cli";

const config:CodegenConfig = {
    schema:"https://graphql.anilist.co",
    documents: ["src/**/*.{ts, tsx}"],
    ignoreNoDocuments:true,
    overwrite:true,
    generates: {
        "./src/__generated__/": {
            overwrite:true,
            plugins:["typescript", "typescript-operations", "typescript-compatibility", {add: {content: "/* THIS IS A GENERATED FILE */"}}, {add: {content: "/* eslint-disable */"}}],
            preset:"client",
            presetConfig:{
                gqlTagName: "gql"
            }
        }
    }
};

export default config;



