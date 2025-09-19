const mysql = require('mysql2');
const fs = require('fs');

// Read the SQL file
const sql = fs.readFileSync('user_db_clean.sql', 'utf8');


// Connect to Railway MySQL
const db = mysql.createConnection({
  host: 'tramway.proxy.rlwy.net',
  user: 'root',
  password: 'oMBMqGVoEaoRjKsxqHIVPTSfEfOdCwpx',
  database: 'railway',
  port: 49489,
  ssl: { rejectUnauthorized: false }  // <-- add this line
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to Railway MySQL!');
  
  // Split the SQL file into individual statements
  const statements = sql.split(/;\s*$/m);
  
  // Execute each statement sequentially
  (async () => {
    for (let stmt of statements) {
      if (stmt.trim()) {
        await new Promise((resolve, reject) => {
          db.query(stmt, (err, result) => {
            if (err) {
              console.error('❌ Error executing statement:', stmt, '\n', err);
            }
            resolve();
          });
        });
      }
    }
    console.log('✅ SQL import completed!');
    db.end();
  })();
});
