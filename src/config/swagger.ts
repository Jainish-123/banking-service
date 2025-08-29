import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Banking Service API",
    version: "1.0.0",
    description: "RESTful Banking Microservice APIs",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
