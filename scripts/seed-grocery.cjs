const { neon } = require("@neondatabase/serverless");
const crypto = require("node:crypto");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Example: DATABASE_URL=... npm run seed:grocery");
}

const sql = neon(databaseUrl);

const seedItems = [
  { name: "Bananas", category: "Produce", quantity: 6, priority: "medium", purchased: false },
  { name: "Avocado", category: "Produce", quantity: 3, priority: "high", purchased: false },
  { name: "Greek Yogurt", category: "Dairy", quantity: 2, priority: "medium", purchased: true },
  { name: "Cheddar Cheese", category: "Dairy", quantity: 1, priority: "low", purchased: false },
  { name: "Sourdough Bread", category: "Bakery", quantity: 1, priority: "high", purchased: false },
  { name: "Pasta", category: "Pantry", quantity: 2, priority: "low", purchased: false },
  { name: "Tomato Sauce", category: "Pantry", quantity: 2, priority: "medium", purchased: true },
  { name: "Granola Bars", category: "Snacks", quantity: 5, priority: "medium", purchased: false },
  { name: "Dark Chocolate", category: "Snacks", quantity: 2, priority: "low", purchased: false },
  { name: "Eggs", category: "Dairy", quantity: 12, priority: "high", purchased: false },
];

async function seed() {
  await sql`
    CREATE TABLE IF NOT EXISTS grocery_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      purchased BOOLEAN NOT NULL DEFAULT FALSE,
      priority TEXT NOT NULL DEFAULT 'medium',
      updated_at BIGINT NOT NULL
    )
  `;

  for (const item of seedItems) {
    await sql`
      INSERT INTO grocery_items (id, name, category, quantity, purchased, priority, updated_at)
      VALUES (
        ${crypto.randomUUID()},
        ${item.name},
        ${item.category},
        ${item.quantity},
        ${item.purchased},
        ${item.priority},
        ${Date.now()}
      )
    `;
  }

  console.log(`Seed complete: inserted ${seedItems.length} grocery items.`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});