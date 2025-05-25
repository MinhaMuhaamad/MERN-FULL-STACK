const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
