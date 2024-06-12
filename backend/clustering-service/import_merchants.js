const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();


const API_URL = process.env.CTX_API_URL
const API_KEY = process.env.CTX_API_KEY
const API_SECRET = process.env.CTX_API_SECRET
const API_ACCESS_TOKEN = ''


async function fetchMerchants(){
    console.log(API_URL)
    try {
        const response = await fetch(`${API_URL}/merchants`, {
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
        const merchants = data.result.map(merchant => ({
            merchantId: merchant.merchantId,
            longitude: merchant.longitude,
            latitude: merchant.latitude
        }));
        return merchants;
    } catch (error) {
        console.error('Error fetching merchants:', error);
        return [];
    }
}

function writeMerchantsToFile(merchants){
    const filePath = path.join(__dirname, 'merchants.txt');
    const header = 'merchantId,longitude,latitude\n';
    const rows = merchants.map(merchant => `${merchant.merchantId},${merchant.longitude || ''},${merchant.latitude || ''}`).join('\n');

    fs.writeFileSync(filePath, header + rows, 'utf-8');
    console.log(`Merchants data written to ${filePath}`);
}

async function main() {
    const merchants = await fetchMerchants();
    writeMerchantsToFile(merchants);
}

main().catch(error => console.error('Error in main function:', error));
