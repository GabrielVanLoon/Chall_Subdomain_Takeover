const fs = require('fs')
const sqlite3 = require('sqlite3');
const { config } = require('../config')

// Loading variables
const vanloonContent = fs.readFileSync('views/author_vanloon.ejs')
const charlesContent = fs.readFileSync('views/author_charles.ejs')
const vanloonDomain  = `vanloon.${config.SERVER_BLOG_HOSTNAME}`
const charlesDomain  = `charles.${config.SERVER_BLOG_HOSTNAME}`

const db = new sqlite3.Database(''); // Anonymous disk-based database.

db.serialize(function() {
    db.run(`CREATE TABLE users (
        username VARCHAR(20) PRIMARY KEY,
        password VARCHAR(60) NOT NULL,
        domain   VARCHAR(200),
        content  TEXT
    );`);

    db.run(`INSERT INTO users VALUES 
    ('admin', 'admin', 'never.gonna.give.you.up.com', '<h1>Never Gonna let you downnnn! Never gonna tell a lie.. or hurt you sz</h1>'),
    ('vanloon', 'vanloon_209345723457892365987234587', ?, ?),
    ('charles', 'charles_123490y57123458y23469587234', ?, ?);
    `, [vanloonDomain, vanloonContent, charlesDomain, charlesContent])
});


module.exports = { db }