/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.13.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clipdrop from "../clipdrop.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as openai from "../openai.js";
import type * as podcasts from "../podcasts.js";
import type * as tasks from "../tasks.js";
import type * as unrealspeech from "../unrealspeech.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clipdrop: typeof clipdrop;
  files: typeof files;
  http: typeof http;
  openai: typeof openai;
  podcasts: typeof podcasts;
  tasks: typeof tasks;
  unrealspeech: typeof unrealspeech;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
