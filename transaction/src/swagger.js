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
      Product: {
        id: "id",
        name: "product name",
        description: "product description",
        price: 100.00,
        inactive: false,
        facilityId: 1,
        createdAt: "2025-01-01T01:00:00.000Z",
        updatedAt: "2025-01-01T01:00:00.000Z",
        _links: [
          {$ref: "#/components/schemas/HateoasLink"}
        ]
      },
      CreateOrUpdateProduct: {
        name: "product name",
        description: "product description",
        price: 100.00,
        inactive: false,
        facilityId: 1
      },
      Facility: {
        id: "id",
        name: "facility name",
        description: "facility description",
        type: "store, attraction or other",
        latitude: -10.000000,
        longitude: 10.000000,
        inactive: false,
        createdAt: "2025-01-01T01:00:00.000Z",
        updatedAt: "2025-01-01T01:00:00.000Z",
        _links: [
          {$ref: "#/components/schemas/HateoasLink"}
        ]
      },
      CreateOrUpdateFacility: {
        name: "facility name",
        description: "facility description",
        type: "store, attraction or other",
        latitude: -10.000000,
        longitude: 10.000000,
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
