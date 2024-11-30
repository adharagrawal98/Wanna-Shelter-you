const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const paypalRoutes = require('./routes/paypalRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

app.use('/api/paypal', paypalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
