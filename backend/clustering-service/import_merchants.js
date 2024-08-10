const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const API_URL = process.env.CTX_API_URL;
const API_KEY = process.env.CTX_API_KEY;
const API_SECRET = process.env.CTX_API_SECRET;
const API_ACCESS_TOKEN = "";

async function fetchMerchants() {
  console.log(API_URL);
  let locations = [];
  let page = 1;
  let totalPages = 1; // Assuming at least 1 page to start

  try {
    while (page <= totalPages) {
      console.log("page is: ", page);
      const response = await fetch(`${API_URL}/merchants?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          "X-Api-Key": API_KEY,
          "X-Api-Secret": API_SECRET,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      totalPages = data.pagination.pages;

      const merchants = data.result; // Assuming this contains the merchant list

      for (const merchant of merchants) {
        const merchantId = merchant.id;

        // Fetch the mapPinUrl for this merchant
        const mapPinResponse = await fetch(
          `${API_URL}/merchants/${merchantId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
              "X-Api-Key": API_KEY,
              "X-Api-Secret": API_SECRET,
            },
          }
        );

        if (!mapPinResponse.ok) {
          throw new Error(
            `Error fetching map pin URL for merchant ${merchantId}: ${mapPinResponse.statusText}`
          );
        }

        const merchantDetails = await mapPinResponse.json();
        const mapPinUrl = merchantDetails.mapPinUrl; // Adjust based on the actual API response structure
        console.log(mapPinUrl);

        locations = locations.concat([{ merchantId, mapPinUrl }]);
      }

      page++;
    }

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

function writeMerchantsToFile(merchants) {
  const filePath = path.join(__dirname, "merchants.txt");
  const header = "merchantId,mapPinUrl\n";
  const rows = merchants
    .map((merchant) => `${merchant.merchantId},${merchant.mapPinUrl || ""}`)
    .join("\n");

  fs.writeFileSync(filePath, header + rows, "utf-8");
  console.log(`Merchants data written to ${filePath}`);
}

async function main() {
  const merchants = await fetchMerchants();
  writeMerchantsToFile(merchants);
}

main().catch((error) => console.error("Error in main function:", error));
