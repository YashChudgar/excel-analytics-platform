const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const path = require("path");
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use("/api", uploadRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


app.get('/', (req, res) => res.send('API running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));