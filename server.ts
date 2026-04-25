import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial DB setup
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    wallpapers: [],
    categories: ['Nature', 'Cars', 'Anime', 'Islamic', 'Abstract', 'AMOLED', 'Dark'],
    stats: { downloads: 0, views: 0 }
  }, null, 2));
}

function getDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use('/uploads', express.static(UPLOADS_DIR));

  // API Routes
  app.get('/api/wallpapers', (req, res) => {
    const db = getDB();
    res.json(db.wallpapers);
  });

  app.get('/api/categories', (req, res) => {
    const db = getDB();
    res.json(db.categories);
  });

  app.get('/api/stats', (req, res) => {
    const db = getDB();
    res.json(db.stats);
  });

  // Admin Actions
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    // Simple hardcoded admin password for demo
    if (password === 'admin123') {
      res.json({ success: true, token: 'mock-admin-token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  });

  app.post('/api/wallpapers', upload.single('image'), (req, res) => {
    const { title, category, isPremium } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const db = getDB();
    const newWallpaper = {
      id: uuidv4(),
      title,
      category,
      isPremium: isPremium === 'true',
      imageUrl: `/uploads/${file.filename}`,
      createdAt: new Date().toISOString(),
      views: 0,
      downloads: 0
    };

    db.wallpapers.unshift(newWallpaper);
    saveDB(db);

    res.status(201).json(newWallpaper);
  });

  app.delete('/api/wallpapers/:id', (req, res) => {
    const { id } = req.params;
    const db = getDB();
    const index = db.wallpapers.findIndex((w: any) => w.id === id);
    
    if (index !== -1) {
      const wallpaper = db.wallpapers[index];
      const filePath = path.join(__dirname, 'public', wallpaper.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      db.wallpapers.splice(index, 1);
      saveDB(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'NotFound' });
    }
  });

  app.post('/api/wallpapers/track/:id/:type', (req, res) => {
    const { id, type } = req.params; // type: 'view' or 'download'
    const db = getDB();
    const wallpaper = db.wallpapers.find((w: any) => w.id === id);
    
    if (wallpaper) {
      if (type === 'view') {
        wallpaper.views++;
        db.stats.views++;
      } else if (type === 'download') {
        wallpaper.downloads++;
        db.stats.downloads++;
      }
      saveDB(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'NotFound' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
