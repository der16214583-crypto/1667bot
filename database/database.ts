import sqlite3 from 'sqlite3';
import { config } from '../config/config';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = config.databasePath;
const dbDir = path.dirname(dbPath);

// Veritabanı dizinini oluştur
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('Veritabanı bağlantısı başarılı');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Log kanalları tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS log_channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id TEXT UNIQUE NOT NULL,
        channel_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('log_channels tablosu oluşturulurken hata:', err);
      }
    });

    // Log kayıtları tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS log_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_name TEXT NOT NULL,
        user_id TEXT,
        user_tag TEXT,
        action TEXT NOT NULL,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('log_entries tablosu oluşturulurken hata:', err);
      }
    });

    // Server ayarları tablosu
    db.run(`
      CREATE TABLE IF NOT EXISTS server_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('server_settings tablosu oluşturulurken hata:', err);
      }
    });
  });
}

export function closeDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Veritabanı bağlantısı kapatıldı');
        resolve();
      }
    });
  });
}
