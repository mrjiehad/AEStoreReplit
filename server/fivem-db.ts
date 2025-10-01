import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function createPool() {
  if (!process.env.FIVEM_DB_HOST) {
    throw new Error('FiveM database credentials not configured');
  }

  return mysql.createPool({
    host: process.env.FIVEM_DB_HOST,
    user: process.env.FIVEM_DB_USER,
    password: process.env.FIVEM_DB_PASSWORD,
    database: process.env.FIVEM_DB_NAME,
    port: parseInt(process.env.FIVEM_DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

export async function insertRedemptionCodeToFiveM(code: string, creditValue: number) {
  try {
    const connection = getPool();
    const table = process.env.FIVEM_DB_TABLE || 'ak4y_donatesystem_codes';
    const codeColumn = process.env.FIVEM_DB_COLUMN_CODE || 'code';
    const creditColumn = process.env.FIVEM_DB_COLUMN_CREDITSVALUE || 'credit';

    const query = `INSERT INTO ${table} (${codeColumn}, ${creditColumn}) VALUES (?, ?)`;
    
    await connection.execute(query, [code, creditValue]);
    
    console.log(`✓ Inserted code ${code} with ${creditValue} credits into FiveM database`);
    return true;
  } catch (error) {
    console.error('Failed to insert code into FiveM database:', error);
    throw error;
  }
}

export async function testFiveMConnection() {
  try {
    const connection = getPool();
    await connection.query('SELECT 1');
    console.log('✓ FiveM database connection successful');
    return true;
  } catch (error) {
    console.error('✗ FiveM database connection failed:', error);
    return false;
  }
}
