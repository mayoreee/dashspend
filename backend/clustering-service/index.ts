import { Express, Request, Response } from "express";
import express = require("express");
import "dotenv/config";
import { Postgress } from "./api/infrastructure/Postgres";
import { Locations } from "./api/repositories/Locations";
import { LocationCluster } from "./api/usecases/LocationCluster";

async function startApi() {
  const app: Express = express();

  const host = String(process.env.PG_HOST);
  const username = String(process.env.PG_USERNAME);
  const password = String(process.env.PG_PASSWORD);
  const database = String(process.env.PG_DATABASE);
  const port = Number(process.env.PG_PORT);
  const ssl = {
    rejectUnauthorized: true,
    ca: String(process.env.PG_SSL_CA),
  };
  const db = new Postgress(host, username, password, database, port, ssl);

  // Check if the database connection is successful
  try {
    await db.checkConnection(); // Assuming checkConnection is an async method in Postgress class
    console.log("Database connection successful");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with failure code
  }

  const locationRepository = new Locations(db.getPool());
  const locationClusterUseCase = new LocationCluster(locationRepository);

  // Middleware to enable CORS
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.get("/points", async (req: Request, res: Response) => {
    const west = Number(req.query.west);
    const south = Number(req.query.south);
    const east = Number(req.query.east);
    const north = Number(req.query.north);
    const zoom = Number(req.query.zoom);

    try {
      const result = await locationClusterUseCase.getClusteredPoint(
        west,
        south,
        east,
        north,
        zoom
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

  app.use(express.static("public"));

  app.listen(8080, () => {
    console.log("server running");
  });
}

startApi();
