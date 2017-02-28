const path  = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

let app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

app.use(express.static(publicPath));

module.exports = { app };
