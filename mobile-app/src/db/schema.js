import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('collections.db');

export const createTables = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Users table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          backend_id TEXT UNIQUE,
          name TEXT NOT NULL,
          email TEXT UNIQUE,
          role TEXT NOT NULL,
          token_meta TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Loans table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS loans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          loan_id TEXT UNIQUE NOT NULL,
          backend_id TEXT,
          customer_name TEXT NOT NULL,
          customer_phone TEXT,
          principal REAL NOT NULL,
          status TEXT NOT NULL,
          agent_id TEXT,
          dpd INTEGER DEFAULT 0,
          bucket TEXT,
          outstanding_amount REAL NOT NULL,
          next_due_date TEXT,
          last_synced_at DATETIME,
          is_dirty INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Schedule table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          loan_id TEXT NOT NULL,
          inst_no INTEGER NOT NULL,
          due_date TEXT NOT NULL,
          amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          paid_amount REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
        );
      `);

      // Payments table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local_id TEXT UNIQUE NOT NULL,
          loan_id TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          mode TEXT NOT NULL,
          agent_id TEXT NOT NULL,
          backend_ref TEXT,
          status TEXT DEFAULT 'queued',
          notes TEXT,
          attachment_path TEXT,
          client_ref TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
        );
      `);

      // PTPs table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ptps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local_id TEXT UNIQUE NOT NULL,
          loan_id TEXT NOT NULL,
          promise_date TEXT NOT NULL,
          amount REAL NOT NULL,
          note TEXT,
          status TEXT DEFAULT 'queued',
          backend_ref TEXT,
          client_ref TEXT UNIQUE NOT NULL,
          agent_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
        );
      `);

      // Notes table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          local_id TEXT UNIQUE NOT NULL,
          loan_id TEXT NOT NULL,
          text TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          status TEXT DEFAULT 'queued',
          backend_ref TEXT,
          client_ref TEXT UNIQUE NOT NULL,
          agent_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loans (loan_id)
        );
      `);

      // Sync queue table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          payload TEXT NOT NULL,
          attempts INTEGER DEFAULT 0,
          last_attempt_at DATETIME,
          status TEXT DEFAULT 'pending',
          error_message TEXT,
          client_ref TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create indexes for better performance
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_loans_agent ON loans(agent_id);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(next_due_date);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);');
      tx.executeSql('CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);');
      
    }, reject, resolve);
  });
};

export const getDatabase = () => db;

export default db;