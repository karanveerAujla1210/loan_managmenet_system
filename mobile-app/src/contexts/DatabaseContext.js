import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const database = SQLite.openDatabase('nbfc_collections.db');
      
      // Create tables
      database.transaction(tx => {
        // Loans table
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS loans (
            id TEXT PRIMARY KEY,
            loanId TEXT,
            customerId TEXT,
            customerName TEXT,
            customerPhone TEXT,
            principalAmount REAL,
            emiAmount REAL,
            dpd INTEGER,
            bucket TEXT,
            status TEXT,
            assignedAgent TEXT,
            lastSyncAt TEXT,
            data TEXT
          )
        `);

        // Payments table (offline queue)
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientRef TEXT UNIQUE,
            loanId TEXT,
            amount REAL,
            paymentMethod TEXT,
            reference TEXT,
            createdAt TEXT,
            synced INTEGER DEFAULT 0,
            data TEXT
          )
        `);

        // Notes table (offline queue)
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientRef TEXT UNIQUE,
            loanId TEXT,
            description TEXT,
            createdAt TEXT,
            synced INTEGER DEFAULT 0
          )
        `);

        // PTP table (offline queue)
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS ptps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientRef TEXT UNIQUE,
            loanId TEXT,
            ptpDate TEXT,
            ptpAmount REAL,
            notes TEXT,
            createdAt TEXT,
            synced INTEGER DEFAULT 0
          )
        `);
      });

      setDb(database);
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  };

  const value = {
    db
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};