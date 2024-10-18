import swaggerJsdoc from "swagger-jsdoc";
import { readFileSync } from "fs";
import { join } from "path";

// 'npx prisma generate' JSON schema
const generatedSchema = JSON.parse(
  readFileSync(
    join(__dirname, "../prisma/json-schema/json-schema.json"),
    "utf-8"
  )
);

// replace $ref paths
function replaceRefPaths(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(replaceRefPaths);
  }

  const newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$ref" && typeof value === "string") {
      newObj[key] = value.replace("#/definitions/", "#/components/schemas/");
    } else {
      newObj[key] = replaceRefPaths(value);
    }
  }
  return newObj;
}

const processedSchemas = Object.fromEntries(
  Object.entries(generatedSchema.definitions).map(([key, value]) => [
    key,
    replaceRefPaths(value),
  ])
);

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Greed Island API",
      version: "1.0.0",
      description: "API documentation for the Greed Island game",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: processedSchemas,
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const specs = swaggerJsdoc(options);
