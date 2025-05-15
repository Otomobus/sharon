
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');
const cors = require('cors');
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
