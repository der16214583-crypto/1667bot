"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Log kayıtlarını getir
app.get('/api/logs/:channelName', async (req, res) => {
    try {
        const { channelName } = req.params;
        const limit = Math.min(parseInt(req.query.limit) || 50, 1000); // Max 1000
        database_1.db.all('SELECT * FROM log_entries WHERE channel_name = ? ORDER BY timestamp DESC LIMIT ?', [channelName, limit], (err, rows) => {
            if (err) {
                console.error('API hatası (logs):', err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows || []);
        });
    }
    catch (error) {
        console.error('API hatası (logs):', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Tüm log kanallarını getir
app.get('/api/channels', async (req, res) => {
    database_1.db.all('SELECT * FROM log_channels', [], (err, rows) => {
        if (err) {
            console.error('Kanal listesi getirilirken hata:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});
// İstatistikler
app.get('/api/stats', async (req, res) => {
    database_1.db.all(`SELECT channel_name, COUNT(*) as count 
     FROM log_entries 
     GROUP BY channel_name`, [], (err, rows) => {
        if (err) {
            console.error('API hatası (stats):', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
    });
});
const PORT = parseInt(process.env.API_PORT || '3000');
app.listen(PORT, () => {
    console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});
