import { Pool, PoolConfig } from "pg";

export class Postgress {
  private pool: Pool;

  constructor(
    host: string,
    username: string,
    password: string,
    database: string,
    port: number,
    ssl: any
  ) {
    const config: PoolConfig = {
      host,
      user: username,
      password,
      database,
      port,
      ssl,
    };
    this.pool = new Pool(config);
  }

  getPool(): Pool {
    return this.pool;
  }

  async checkConnection(): Promise<void> {
    try {
      const client = await this.pool.connect();
      client.release();
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }
  }
}
