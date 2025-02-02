# DB Visualizer

A modern, responsive database visualization tool built with React and TypeScript. This application allows you to connect to a PostgreSQL database, execute SQL queries, and visualize the results in a clean, intuitive interface.

## Features

- 🔒 Secure authentication system
- 📝 SQL query editor with execution capabilities
- 📊 Dynamic data table with pagination and sorting
- 🌓 Light/Dark theme support
- 🎨 Modern UI with shadcn/ui components
- 🔄 Real-time query results
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/db-visualizer.git
   cd db-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Connecting to PostgreSQL

To connect this application to a PostgreSQL database, you'll need to:

1. Create a backend service (e.g., using Express.js or Next.js API routes)
2. Set up the following environment variables in your backend:
   ```env
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   POSTGRES_HOST=your_host
   POSTGRES_DB=your_database
   POSTGRES_PORT=5432
   POSTGRES_SSL=false  # Set to true if using SSL connection
   ```
3. Create an API endpoint that accepts SQL queries and returns results
4. Update the `executeQuery` function in `src/lib/db.ts` to make HTTP requests to your backend

Example backend setup:

```typescript
// backend/server.js
import express from 'express';
import { Pool } from 'pg';

const app = express();
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.POSTGRES_SSL === 'true' 
    ? { rejectUnauthorized: false } 
    : undefined,
});

app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Database error' 
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Then update the frontend code:

```typescript
// src/lib/db.ts
export async function executeQuery(query: string): Promise<any[]> {
  const response = await fetch('http://localhost:3000/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}
```

### Security Considerations

- Always use environment variables for database credentials
- Never commit sensitive information to version control
- Use SSL connections in production
- Implement proper access controls and user permissions
- Sanitize SQL queries to prevent SQL injection
- Use CORS policies to restrict API access

## Development Mode

The application currently runs in development mode using sample data. The sample data includes:
- Users table
- Products table
- Orders table

Try these example queries:
```sql
SELECT * FROM users
SELECT * FROM products
SELECT * FROM orders
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)