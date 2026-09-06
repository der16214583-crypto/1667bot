import express from 'express';
import { db } from '../database/database';

const app = express();
app.use(express.json());

// Log kayıtlarını getir
app.get('/api/logs/:channelName', (req, res) => {
  try {
    const { channelName } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 1000); // Max 1000

    db.all(
      'SELECT * FROM log_entries WHERE channel_name = ? ORDER BY timestamp DESC LIMIT ?',
      [channelName, limit],
      (err, rows) => {
        if (err) {
          console.error('Log kayıtları getirilirken hata:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    console.error('API hatası (logs):', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tüm log kanallarını getir
app.get('/api/channels', (req, res) => {
  try {
    db.all('SELECT * FROM log_channels', (err, rows) => {
      if (err) {
        console.error('Kanal listesi getirilirken hata:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows || []);
    });
  } catch (error) {
    console.error('API hatası (channels):', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// İstatistikler
app.get('/api/stats', (req, res) => {
  try {
    db.all(
      `SELECT channel_name, COUNT(*) as count 
       FROM log_entries 
       GROUP BY channel_name`,
      [],
      (err, rows) => {
        if (err) {
          console.error('İstatistikler getirilirken hata:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    console.error('API hatası (stats):', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = parseInt(process.env.API_PORT || '3000');
app.listen(PORT, () => {
  console.log(`API sunucusu ${PORT} portunda çalışıyor`);
});

