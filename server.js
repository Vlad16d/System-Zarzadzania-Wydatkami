const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API działa 🚀');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});