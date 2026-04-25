const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            user_id INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL,
            date TEXT,
            category_id INTEGER,
            description TEXT,
            user_id INTEGER
        )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS Budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        month TEXT,
        limit_amount REAL
    )
`);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            user_id INTEGER
        )
    `);

    // 👉 добавляем базовые категории ТОЛЬКО если их нет
    const defaultCategories = [
        "Jedzenie",
        "Transport",
        "Rozrywka",
        "Zdrowie",
        "Rachunki"
    ];

    defaultCategories.forEach(name => {
        db.get(
            `SELECT * FROM Categories WHERE name = ? AND user_id IS NULL`,
            [name],
            (err, row) => {
                if (!row) {
                    db.run(
                        `INSERT INTO Categories (name, user_id) VALUES (?, NULL)`,
                        [name]
                    );
                }
            }
        );
    });
});

});

db.run("DELETE FROM Categories");

module.exports = db;