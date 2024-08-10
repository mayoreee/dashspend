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

readAndInsertTXT();

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
    const [merchantId, mapPinUrl] = row;

    const insertQuery = `
    UPDATE marker_cluster
    SET map_pin_url = $1
    WHERE merchant_id = $2;
    `;

    pool.query(insertQuery, [mapPinUrl, merchantId], (error, results) => {
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
