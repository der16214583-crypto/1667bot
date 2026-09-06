"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
let sqlite3 = null;
try {
    sqlite3 = require('sqlite3').verbose();
}
catch (e) {
    console.error('sqlite3 module not found, SQLite fallback disabled');
}
// @ts-ignore
const { Pool } = require('pg');
const config_1 = require("../config/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Determine which DB to use. If DATABASE_URL is set, use PostgreSQL; otherwise fallback to SQLite.
const dbUrl = process.env.DATABASE_URL;
// ---------- SQLite fallback ----------
const sqlitePath = config_1.config.databasePath;
const sqliteDir = path.dirname(sqlitePath);
if (!fs.existsSync(sqliteDir)) {
    fs.mkdirSync(sqliteDir, { recursive: true });
}
// Initialize SQLite only if module is available
let sqliteDb = null;
if (sqlite3) {
    sqliteDb = new sqlite3.Database(sqlitePath, err => {
        if (err) {
            console.error('SQLite connection error:', err.message);
        }
        else {
            console.log('SQLite connected');
            if (!dbUrl)
                initializeSQLite();
        }
    });
}
else {
    console.warn('SQLite not initialized due to missing module');
}
function initializeSQLite() {
    sqliteDb.serialize(() => {
        sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS log_channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id TEXT UNIQUE NOT NULL,
        channel_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS log_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_name TEXT NOT NULL,
        user_id TEXT,
        user_tag TEXT,
        action TEXT NOT NULL,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS server_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    });
}
// ---------- PostgreSQL primary ----------
let pgPool = null;
if (dbUrl) {
    pgPool = new Pool({ connectionString: dbUrl });
    (async () => {
        try {
            await pgPool.query(`
        CREATE TABLE IF NOT EXISTS log_channels (
          id SERIAL PRIMARY KEY,
          channel_id TEXT UNIQUE NOT NULL,
          channel_name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            await pgPool.query(`
        CREATE TABLE IF NOT EXISTS log_entries (
          id SERIAL PRIMARY KEY,
          channel_name TEXT NOT NULL,
          user_id TEXT,
          user_tag TEXT,
          action TEXT NOT NULL,
          details TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            await pgPool.query(`
        CREATE TABLE IF NOT EXISTS server_settings (
          id SERIAL PRIMARY KEY,
          setting_key TEXT UNIQUE NOT NULL,
          setting_value TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log('PostgreSQL tables ensured');
        }
        catch (e) {
            console.error('Error initializing PostgreSQL tables:', e);
        }
    })();
}
/**
 * Helper to convert SQLite "?" placeholders to PostgreSQL "$n" when using pg.
 */
function toPgPlaceholders(sql) {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
}
/** Unified DB interface compatible with existing callback usage */
// Updated db interface with overloads for flexibility
exports.db = {
    run(sql, params = [], callback) {
        if (pgPool) {
            const pgSql = toPgPlaceholders(sql);
            pgPool
                .query(pgSql, params)
                .then(() => callback && callback(null))
                .catch((err) => callback && callback(err));
        }
        else {
            sqliteDb.run(sql, params, function (err) {
                if (callback)
                    callback(err);
            });
        }
    },
    get(sql, params = [], callback) {
        if (pgPool) {
            const pgSql = toPgPlaceholders(sql);
            pgPool
                .query(pgSql, params)
                .then(res => {
                const row = res.rows[0] || null;
                if (callback)
                    callback(null, row);
            })
                .catch((err) => {
                if (callback)
                    callback(err, null);
            });
        }
        else {
            sqliteDb.get(sql, params, (err, row) => {
                if (callback)
                    callback(err, row);
            });
        }
    },
    // Overload signatures: (sql, callback) OR (sql, params, callback)
    all: function (sql, arg1, arg2) {
        let params = [];
        let callback;
        if (typeof arg1 === 'function') {
            callback = arg1;
        }
        else {
            params = arg1 || [];
            callback = arg2;
        }
        if (pgPool) {
            const pgSql = toPgPlaceholders(sql);
            pgPool
                .query(pgSql, params)
                .then(res => {
                if (callback)
                    callback(null, res.rows);
            })
                .catch((err) => {
                if (callback)
                    callback(err, []);
            });
        }
        else {
            sqliteDb.all(sql, params, (err, rows) => {
                if (callback)
                    callback(err, rows);
            });
        }
    },
    async closeDatabase() {
        if (pgPool) {
            await pgPool.end();
            console.log('PostgreSQL pool closed');
        }
        else {
            return new Promise((resolve, reject) => {
                sqliteDb.close(err => {
                    if (err)
                        reject(err);
                    else {
                        console.log('SQLite connection closed');
                        resolve();
                    }
                });
            });
        }
    }
};
