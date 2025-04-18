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
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    },
    schemas: {
      Unauthorized: {
        code: "401",
      },
      NotFound: {
        code: "404",
        message: "",
      },
      InternalServerError: {
        code: "500",
        message: "",
      },
      PaymentRequired: {
        code: "402",
        message: "",
      },
      Page: {
        current: 1,
        total: 1,
        size: 10
      },
      HateoasLink: {
        rel: "rel",
        href: "/api/endpoint",
        method: "METHOD"
      },
      ItemsTransaction: {
        id: "id",
        productId: "id",
        quantity: 10,
        totalValue: 100.00,
        _links: [
          {$ref: "#/components/schemas/HateoasLink"}
        ]
      },
      CreateOrUpdateItemTransaction: {
        productId: "id",
        quantity: 10,
        totalValue: 100.00
      },
      Transaction: {
        id: "id",
        userId: "userId",
        totalValue: 10.00,
        operation: "purchase or credit",
        inactive: false,
        createdAt: "2025-01-01T01:00:00.000Z",
        updatedAt: "2025-01-01T01:00:00.000Z",
        _links: [
          {$ref: "#/components/schemas/HateoasLink"}
        ]
      },
      CreateOrUpdateTransaction: {
        userId: "userId",
        totalValue: 10.00,
        operation: "purchase or credit",
        inactive: false
      },
    }
  }
};

const outputFile = "./config/swagger.json";
const endpointFiles = ["./routes.js"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointFiles, doc)
  .then(async () => {
    await import("./server.js");
  });
