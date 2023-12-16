/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery USER_AUTH{\n  Viewer {\n    id\n    name\n    avatar {\n      medium\n    }\n    options{\n      displayAdultContent\n    }\n    mediaListOptions{\n      scoreFormat\n    }\n  }\n}\n": types.User_AuthDocument,
    "\nquery GET_GENRES{\n  GenreCollection\n}\n": types.Get_GenresDocument,
    "\nquery GET_TAGS{\n  MediaTagCollection{\n    id\n    name\n    description\n    category\n\t\tisAdult\n  }\n}\n": types.Get_TagsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery USER_AUTH{\n  Viewer {\n    id\n    name\n    avatar {\n      medium\n    }\n    options{\n      displayAdultContent\n    }\n    mediaListOptions{\n      scoreFormat\n    }\n  }\n}\n"): (typeof documents)["\nquery USER_AUTH{\n  Viewer {\n    id\n    name\n    avatar {\n      medium\n    }\n    options{\n      displayAdultContent\n    }\n    mediaListOptions{\n      scoreFormat\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GET_GENRES{\n  GenreCollection\n}\n"): (typeof documents)["\nquery GET_GENRES{\n  GenreCollection\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GET_TAGS{\n  MediaTagCollection{\n    id\n    name\n    description\n    category\n\t\tisAdult\n  }\n}\n"): (typeof documents)["\nquery GET_TAGS{\n  MediaTagCollection{\n    id\n    name\n    description\n    category\n\t\tisAdult\n  }\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;