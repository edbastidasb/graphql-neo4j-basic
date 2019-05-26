import { typeDefs } from "./graphql-schema";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from "dotenv";

// establecer variables de entorno desde ../.env
dotenv.config();

const app = express();

/*
 * Crear un objeto de esquema GraphQL ejecutable a partir de definiciones de tipo GraphQL
 * Incluyendo consultas autogeneradas y mutaciones.
 */

const schema = makeAugmentedSchema({
  typeDefs
});

/*
 * Cree una instancia de controlador Neo4j para conectarse a la base de datos
 * usando credenciales especificadas como variables de entorno
 * con cambio a los valores predeterminados
 */
const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

/*
 * Cree una nueva instancia de ApolloServer, que sirva el esquema GraphQL
 * creado usando makeAugmentedSchema anterior e inyectando el controlador Neo4j
 * instancia en el objeto de contexto por lo que está disponible en el
 * Resuelve generadores para conectarse a la base de datos.
 */
const server = new ApolloServer({
  context: { driver },
  schema: schema,
  introspection: true,
  playground: true
});

// Especifique el puerto y la ruta para el punto final de GraphQL
const port = process.env.GRAPHQL_LISTEN_PORT || 4001;
const path = "/graphql";

/*
* Opcionalmente, aplique el middleware Express para la autenticación, etc.
* Esto también nos permite especificar una ruta para el punto final GraphQL
*/
server.applyMiddleware({app, path});

app.listen({port, path}, () => {
  console.log(`GraphQL server ready at http://localhost:${port}${path}`);
});