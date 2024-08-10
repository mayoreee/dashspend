import { DatabaseError, Pool, QueryResult } from "pg";

class Locations {
  private db: Pool;

  constructor(pool: Pool) {
    this.db = pool;
  }

  async getPointsInsideBoundingBox(
    west: string,
    south: string,
    east: string,
    north: string
  ): Promise<QueryResult<any>> {
    try {
      const result = await this.db.query({
        text: `
          SELECT 
            id, 
            ST_Y(location) AS y, 
            ST_X(location) AS x,
            merchant_id,
            map_pin_url
          FROM 
            marker_cluster 
          WHERE 
            location && ST_MakeEnvelope($1, $2, $3, $4, 4326)
        `,
        values: [west, south, east, north],
      });

      console.log("Query result:", result.rows);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }
}

export { Locations };
