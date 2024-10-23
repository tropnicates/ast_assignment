const express = require('express');
const connectDB = require('./config/db');
const ruleRoutes = require('./routes/RulesRoutes');
const cors = require('cors');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/rules', ruleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));