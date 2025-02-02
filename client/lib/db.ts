// Sample data for development
const SAMPLE_DATA = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", created_at: "2024-03-20" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", created_at: "2024-03-19" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", created_at: "2024-03-18" },
  ],
  products: [
    { id: 1, name: "Laptop", price: 999.99, stock: 50 },
    { id: 2, name: "Smartphone", price: 499.99, stock: 100 },
    { id: 3, name: "Headphones", price: 99.99, stock: 200 },
  ],
  orders: [
    { id: 1, user_id: 1, total: 1499.98, status: "completed" },
    { id: 2, user_id: 2, total: 99.99, status: "pending" },
    { id: 3, user_id: 1, total: 499.99, status: "processing" },
  ],
};

export async function executeQuery(query: string): Promise<any[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('select') && lowerQuery.includes('from')) {
    if (lowerQuery.includes('users')) {
      return SAMPLE_DATA.users;
    } else if (lowerQuery.includes('products')) {
      return SAMPLE_DATA.products;
    } else if (lowerQuery.includes('orders')) {
      return SAMPLE_DATA.orders;
    }
  }
  
  throw new Error('Invalid query. Try: SELECT * FROM users, products, or orders');
}

/* PostgreSQL Implementation (commented out for future use)
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export async function executeQuery(query: string): Promise<any[]> {
  const client = await pool.connect();
  try {
    // Add query validation/sanitization here
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}
*/