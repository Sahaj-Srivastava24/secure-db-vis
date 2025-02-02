// Mock authentication for development
type User = {
  id: number;
  email: string;
};

let mockUser: User | null = null;

export async function signIn(credentials: { email: string; password: string }): Promise<User> {
  // Mock authentication logic
  if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
    mockUser = { id: 1, email: credentials.email };
    return mockUser;
  }
  throw new Error('Invalid credentials');
}

export async function signUp(credentials: { email: string; password: string }): Promise<User> {
  // Mock sign up logic
  mockUser = { id: Date.now(), email: credentials.email };
  return mockUser;
}

export async function signOut(): Promise<void> {
  mockUser = null;
}

export async function getSession(): Promise<User | null> {
  return mockUser;
}

/* PostgreSQL Auth Implementation (commented out for future use)
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export async function signIn({ email, password }: { email: string; password: string }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    return { id: user.id, email: user.email };
  } finally {
    client.release();
  }
}

export async function signUp({ email, password }: { email: string; password: string }) {
  const client = await pool.connect();
  try {
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}
*/