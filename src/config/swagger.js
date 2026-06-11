import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vyshnav PC — Portfolio API",
      version: "3.0.3",
      description:
        "Internal REST API powering the personal portfolio website of Vyshnav P C. Includes the HR Campaign Scheduler, Contact form, and Blog management.",
      contact: {
        name: "Vyshnav P C",
        email: "vyshnavpcnaravoor@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
      {
        url: "https://vyshnavpc.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        AdminKeyHeader: {
          type: "apiKey",
          in: "header",
          name: "x-admin-key",
          description: "Admin secret key required for protected endpoints",
        },
        AdminKeyBody: {
          type: "apiKey",
          in: "header",
          name: "x-admin-key",
          description: "Admin key passed in request body as `adminKey`",
        },
      },
      schemas: {
        HrJob: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6650a1b2c3d4e5f678901234" },
            to: {
              type: "string",
              example: "hr@company.com,talent@startup.io",
              description: "Comma-separated list of recipient emails",
            },
            cc: { type: "string", example: "manager@company.com" },
            bcc: { type: "string", example: "hidden@example.com" },
            subject: {
              type: "string",
              example: "Application for Fullstack Developer - Vyshnav P C",
            },
            content: {
              type: "string",
              example: "Hi Team,\n\nI am writing to express my interest...",
            },
            driveLink: {
              type: "string",
              example: "https://drive.google.com/file/d/FILE_ID/view",
            },
            status: {
              type: "string",
              enum: ["active", "paused", "completed"],
              example: "active",
            },
            lastRunAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            ok: { type: "boolean", example: false },
            error: { type: "string", example: "Unauthorized. Invalid Admin Key." },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
