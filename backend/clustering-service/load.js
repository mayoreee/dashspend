const { Pool } = require("pg");
const fs = require("fs");
const { log } = require("console");

const pool = new Pool({
  user: "avnadmin",
  host: "merchants-ctxspend.f.aivencloud.com",
  database: "defaultdb",
  password: "",
  port: 28504,
  ssl: {
    rejectUnauthorized: true,
    ca: ``,
  },
});

// Clean up the table
pool.query(`DELETE FROM marker_cluster;`, (error, results) => {
  if (error) {
    throw error;
  }
  console.log("Table cleaned up.");

  // Read and process the TXT file after the table is cleaned
  readAndInsertTXT();
});

function readAndInsertTXT() {
  // Read the TXT file
  const fileContent = fs.readFileSync("./merchants.txt", "utf8");
  const rows = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const headers = rows[0].split(",");
  const dataRows = rows.slice(1).map((row) => row.split(","));

  insertRows(dataRows, headers);
}

function insertRows(rows, headers) {
  let total = 0;

  rows.forEach((row, index) => {
    const [merchantId, latitude, longitude] = row;

    const insertQuery = `
    INSERT INTO marker_cluster(location, merchant_id) 
    VALUES (
      ST_GeomFromText('Point(${latitude} ${longitude})'),
      $1
    );
  `;

    pool.query(insertQuery, [merchantId], (error, results) => {
      if (error) {
        console.error(`Error inserting data at row ${index + 1}:`, error);
        return;
      }

      if (total % 1000 === 0) {
        console.log(`${total} rows inserted`);
      }

      total++;
    });
  });

  // Listen for the 'drain' event to close the pool when all queries are done
  pool.on("drain", () => {
    pool.end();
    console.log("All data has been inserted.");
  });
}
