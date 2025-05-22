import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

dotenv.config();

const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "This is the API documentation for the application."
  },
  servers: [
    {
      url: `http://localhost:${process.env.SERVER_PORT}`,
      description: "Local server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Unauthorized: {
        code: 401,
        message: "Unauthorized"
      },
      NotFound: {
        code: 404,
        message: "Resource not found"
      },
      InternalServerError: {
        code: 500,
        message: "Internal server error"
      },
      PaymentRequired: {
        code: 402,
        message: "Payment required"
      },
      Page: {
        current: 1,
        total: 1,
        size: 10
      },
      HateoasLink: {
        rel: "self",
        href: "/api/example",
        method: "GET"
      },
      User: {
        id: "uuid",
        name: "John Doe",
        email: "john@example.com",
        cpf: "12345678900",
        birthdate: "1990-01-01",
        active: true,
        role: "CUSTOMER", // <- campo role agora é direto
        createdAt: "2025-01-01T01:00:00.000Z",
        updatedAt: "2025-01-01T01:00:00.000Z",
        _links: [{ $ref: "#/components/schemas/HateoasLink" }]
      },
      CreateOrUpdateUser: {
        name: "John Doe",
        email: "john@example.com",
        cpf: "12345678900",
        password: "StrongPass123",
        birthdate: "1990-01-01",
        active: true,
        role: "CUSTOMER"
      }
    }
  },

  tags: [
    { name: "Login", description: "Autenticação de usuários" },
    { name: "Register", description: "Registro de usuários" },
    { name: "Users", description: "Operações com usuários" }
  ]

};

const outputFile = "./config/swagger.json";
const endpointFiles = ["./routes.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFiles, doc)
  .then(async () => {
    await import("./server.js");
  });
