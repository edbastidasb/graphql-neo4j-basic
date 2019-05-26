import { neo4jgraphql } from "neo4j-graphql-js";
import fs from "fs";
import path from "path";

/*
 * Verifique la variable de entorno GRAPHQL_SCHEMA para especificar el archivo de esquema
 * retroceder a schema.graphql si la variable de entorno GRAPHQL_SCHEMA no está establecida
 */

export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql")
  )
  .toString("utf-8");