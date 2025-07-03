import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' }); 

async function createDatabaseIfNotExists() {
  const databaseName = process.env.DATABASE_URL?.split('/').pop()?.split('?')[0];

  if (!databaseName) {
    console.error('DATABASE_URL is not set or malformed in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL?.replace(databaseName, 'postgres'),
  });

  try {
    await client.connect();
    console.log(`Connected to PostgreSQL server (on default 'postgres' database).`);


    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`, [databaseName]);

    if (res.rowCount === 0) {
      console.log(`Database '${databaseName}' not found, creating it...`);
      await client.query(`CREATE DATABASE "${databaseName}";`); 
      console.log(`Database '${databaseName}' created successfully.`);
    } else {
      console.log(`Database '${databaseName}' already exists.`);
    }
  } catch (err: any) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabaseIfNotExists();