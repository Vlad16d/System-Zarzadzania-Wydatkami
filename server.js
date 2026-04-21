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

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const expenseRoutes = require('./routes/expenses');
app.use('/expenses', expenseRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/categories', categoryRoutes);

const statsRoutes = require('./routes/stats');
app.use('/stats', statsRoutes);
