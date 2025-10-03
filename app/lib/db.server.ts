import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Expense } from "~/types/expense";

let db: Database<sqlite3.Database, sqlite3.Statement>;

async function getDb() {
  if (!db) {
    db = await open({
      filename: "expenses.db",
      driver: sqlite3.Database,
    });

    // Create table if not exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `);
  }
  return db;
}

export const dbQueries = {
  async getExpenses(filters?: {
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Expense[]> {
    const db = await getDb();
    let query = "SELECT * FROM expenses WHERE 1=1";
    const params: any[] = [];

    if (filters?.category && filters.category !== "all") {
      query += " AND category = ?";
      params.push(filters.category);
    }
    if (filters?.startDate) {
      query += " AND date >= ?";
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      query += " AND date <= ?";
      params.push(filters.endDate);
    }

    query += " ORDER BY date DESC";
    return db.all<Expense[]>(query, params);
  },

  async getExpense(id: number): Promise<Expense | undefined> {
    const db = await getDb();
    return db.get<Expense>("SELECT * FROM expenses WHERE id = ?", [id]);
  },

  async createExpense(data: Omit<Expense, "id">): Promise<Expense> {
    const db = await getDb();
    const result = await db.run(
      `
      INSERT INTO expenses (description, amount, category, date)
      VALUES (?, ?, ?, ?)
      `,
      [data.description, data.amount, data.category, data.date]
    );
    return { id: Number(result.lastID), ...data };
  },

  async updateExpense(id: number, data: Omit<Expense, "id">): Promise<Expense | null> {
  const db = await getDb();
  const result = await db.run(
    `
    UPDATE expenses 
    SET description = ?, amount = ?, category = ?, date = ?
    WHERE id = ?
    `,
    [data.description, data.amount, data.category, data.date, id]
  );

  if ((result.changes ?? 0) === 0) {
    return null; // nothing updated
  }

  return (await this.getExpense(id)) || null;
},

  async deleteExpense(id: number): Promise<boolean> {
  const db = await getDb();
  const result = await db.run("DELETE FROM expenses WHERE id = ?", [id]);
  
  return (result.changes ?? 0) > 0;
}

};
