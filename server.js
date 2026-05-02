const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const expenseRoutes = require('./routes/expenses');
app.use('/expenses', expenseRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/categories', categoryRoutes);

const statsRoutes = require('./routes/stats');
app.use('/stats', statsRoutes);

const budgetRoutes = require('./routes/budget');
app.use('/budget', budgetRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
