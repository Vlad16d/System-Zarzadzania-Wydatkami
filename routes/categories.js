const express = require('express');
const router = express.Router();
const db = require('../db');

// get user categories 
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        `SELECT * FROM Categories WHERE user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// add category
router.post('/', (req, res) => {
    const { name, user_id } = req.body;

    db.run(
        `INSERT INTO Categories (name, user_id) VALUES (?, ?)`,
        [name, user_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                message: 'Категория создана',
                categoryId: this.lastID
            });
        }
    );
});

// delete category
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run(
        `DELETE FROM Categories WHERE id = ?`,
        [id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: 'Категория удалена' });
        }
    );
});

module.exports = router;