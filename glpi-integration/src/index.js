const express = require('express');
const ticketRoutes = require('./routes/ticketRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', ticketRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
