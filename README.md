<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Measure Project

This project is designed to manage individual water and gas consumption readings. The back-end is built using Node.js with TypeScript, Prisma, Docker, and integrates a Google Gemini API to extract values from images.

## Prerequisites

- Node.js
- TypeScript
- Prisma
- Docker
- Git
- Google Gemini API Key

## Tasks Overview

### 1. Initial Setup

- [x] Create a new NestJS project named `measure`.
- [x] Configure the development environment with Node.js and TypeScript.

### 2. Database Configuration

- [x] Design the database schema to store water and gas readings.
- [x] Set up Prisma for database integration.
- [x] Implement migrations to create the required tables.

### 3. API Endpoints Implementation

#### 3.1. POST `/upload`

- **Request**:
  ```json
  {
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "datetime",
    "measure_type": "WATER" ou "GAS"
  }
  ```
- **Response**:
  ```json
  {
    "image_url": "string",
    "measure_value": "integer",
    "measure_uuid": "string"
  }
  ```
- **Description**: This endpoint uploads a new meter reading image. It validates the request, checks for existing readings of the same type in the current month, and extracts the numeric value using the Google Gemini API.

#### 3.2. PATCH `/confirm`

- **Request**:
  ```json
  {
    "measure_uuid": "string",
    "confirmed_value": "integer"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **Description**: This endpoint confirms or corrects the extracted value for a reading. It validates the measure ID and updates the reading in the database.

#### 3.3. GET `/<customer_code>/list?measure_type=WATER`

- **Response**:
  ```json
  {
    "customer_code": "string",
    "measures": [
      {
        "measure_uuid": "string",
        "measure_datetime": "datetime",
        "measure_type": "string",
        "has_confirmed": "boolean",
        "image_url": "string"
      },
      {
        "measure_uuid": "string",
        "measure_datetime": "datetime",
        "measure_type": "string",
        "has_confirmed": "boolean",
        "image_url": "string"
      }
    ]
  }
  ```
- **Description**: This endpoint retrieves all readings for a specific customer, with an optional filter by measure type. It returns a list of readings or an error message if no readings are found.

### 4. Integration with Google Gemini

- [x] Obtain an API key from Google Gemini.
- [x] Configure the API Key using environment variables (`.env`).
- [x] Implement communication with Google Gemini's Vision API to extract values.

### 5. Dockerization

- [x] Create a `Dockerfile` for the application.
- [x] Configure `docker-compose.yml` to run the application and its necessary services with a single command.
- [x] Test the application using Docker.

### 6. Testing

- [x] Write unit tests for the implemented endpoints.
- [x] Ensure test coverage for the main functionalities.

### 7. Documentation

- [x] Document the API using tools like Swagger.
- [x] Update this README with instructions on how to run the project locally and via Docker.

### 8. Submission

- [x] Ensure all requirements are met.
- [x] Push the project to a Git repository.
- [x] Fill out the submission form with the repository link.

## Running the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/Walttinho/measure.git
   cd measure
   ```

2. Copy the `.env.example` file to `.env` and fill in the environment variables:

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=database_name

   GEMINI_API_KEY="your_api_key_here"
   ```

3. Install dependencies and start the application:
   ```bash
   npm install
   npx prisma db push && npx prisma generate
   npm run start:dev
   ```

The service will be available at [http://localhost:3000](http://localhost:3000).

Documentation Swagger will be available at [http://localhost:3000/docs](http://localhost:3000/docs).

## API Endpoints

- **POST /api/upload**: Upload a new meter reading.
- **PATCH /api/confirm**: Confirm or correct a reading.
- **GET /api/<customer_code>/list**: List readings by customer.

For more details on the endpoints, refer to the API documentation (if available).

## Running Tests

To execute the tests, run:

```bash
npm run test
```

## Project Structure and File Descriptions

```
.
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── package-lock.json
├── prisma
│   ├── migrations
│   │   ├── 20240830012043_init
│   │   └── migration_lock.toml
│   └── schema.prisma
├── README.md
├── src
│   ├── app.module.ts
│   ├── customer
│   │   ├── dto
│   │   │   └── customer.dto.ts
│   │   ├── module
│   │   │   └── customer.module.ts
│   │   ├── repository
│   │   │   └── customer.repository.ts
│   │   └── service
│   │       ├── customer.service.spec.ts
│   │       └── customer.service.ts
│   ├── main.ts
│   ├── measure
│   │   ├── controller
│   │   │   ├── measure.controller.spec.ts
│   │   │   └── measure.controller.ts
│   │   ├── dto
│   │   │   └── measure.dto.ts
│   │   ├── module
│   │   │   └── measure.module.ts
│   │   ├── repository
│   │   │   └── measure.repository.ts
│   │   └── service
│   │       ├── measure.service.spec.ts
│   │       └── measure.service.ts
│   └── prisma
│       ├── prisma.module.ts
│       ├── prisma.service.ts
│       └── repositories
│           ├── prisma-customer.repository.ts
│           └── prisma-measure.repository.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json

23 directories, 35 files

```
