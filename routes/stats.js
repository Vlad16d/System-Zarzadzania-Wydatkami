const express = require('express');
const router = express.Router();
const db = require('../db');


// suma wydatkow (za miesiac)
router.get('/monthly/:userId/:month', (req, res) => {
    const { userId, month } = req.params;

    db.get(
        `SELECT SUM(amount) as total 
         FROM Expenses 
         WHERE user_id = ? AND date LIKE ? || '%' = ?`,
        [userId, month],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ total: row.total || 0 });
        }
    );
});

// wydatki wedlug miesiaca
router.get('/monthly-comparison/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT 
            substr(date, 1, 7) as month,
            SUM(amount) as total
         FROM Expenses
         WHERE user_id = ?
         GROUP BY month
         ORDER BY month`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json(rows);
        }
    );
});

// categories wydatkow
router.get('/by-category/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT 
            COALESCE(Categories.name, 'Без категории') as name,
            SUM(Expenses.amount) as total
         FROM Expenses
         LEFT JOIN Categories ON Expenses.category_id = Categories.id
         WHERE Expenses.user_id = ?
         GROUP BY name`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            console.log(rows);
            res.json(rows);
        }
    );
});


module.exports = router;