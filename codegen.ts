import { CodegenConfig } from "@graphql-codegen/cli";

const config:CodegenConfig = {
    schema:"https://graphql.anilist.co",
    documents: ["src/**/*.{ts, tsx}"],
    ignoreNoDocuments:true,
    overwrite:true,
    generates: {
        "./src/__generated__/": {
            
            preset:"client",
            presetConfig:{
                gqlTagName: "gql"
            }
        }
    }
};

export default config;



