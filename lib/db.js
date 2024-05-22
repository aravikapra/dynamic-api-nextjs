const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_project',
  password: 'password',
  port: 5432,
});
  
module.exports = {
  query: (text, params) => pool.query(text, params),
};
