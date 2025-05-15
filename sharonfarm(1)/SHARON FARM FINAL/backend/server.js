const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Paths to store data
const dataPath = {
  product: path.join(__dirname, 'data/products.json'),
  project: path.join(__dirname, 'data/projects.json'),
  award: path.join(__dirname, 'data/awards.json'),
  contact: path.join(__dirname, 'data/contact.json')
};

// Ensure data files exist
for (const key in dataPath) {
  if (!fs.existsSync(dataPath[key])) {
    fs.writeFileSync(dataPath[key], key === 'contact' ? '{}' : '[]');
  }
}

// Helpers
const readJSON = (type) => JSON.parse(fs.readFileSync(dataPath[type], 'utf-8'));
const writeJSON = (type, data) => fs.writeFileSync(dataPath[type], JSON.stringify(data, null, 2));

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  const { type } = req.body;

  if (type === 'contact') {
    const { email } = req.body;
    writeJSON('contact', { email });
    return res.json({ message: 'Contact updated successfully!' });
  }

  if (!['product', 'project', 'award'].includes(type)) {
    return res.status(400).json({ message: 'Invalid upload type.' });
  }

  const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : '';
  const { title, description, category, price } = req.body;

  const newItem = {
    title,
    ...(description && { description }),
    ...(category && { category }),
    ...(price && { price }),
    ...(image && { image })
  };

  const items = readJSON(type);
  items.push(newItem);
  writeJSON(type, items);

  res.json({ message: `${type} uploaded successfully!` });
});

// Get all data
app.get('/data/:type', (req, res) => {
  const type = req.params.type;
  if (!dataPath[type]) return res.status(400).json({ message: 'Invalid data type' });

  const data = readJSON(type);
  res.json(data);
});

// Delete an item by title
app.delete('/delete/:type/:title', (req, res) => {
  const { type, title } = req.params;
  if (!dataPath[type] || type === 'contact') return res.status(400).json({ message: 'Invalid delete type' });

  let items = readJSON(type);
  items = items.filter(item => item.title !== title);
  writeJSON(type, items);

  res.json({ message: 'Item deleted successfully.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
