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
      url: `http://localhost:${process.env.PORT || 4000}`,
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis:
    process.env.NODE_ENV === "demo"
      ? ["./dist/src/modules/**/*.js"]
      : ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
