var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : 'nailton123',
      database : 'apiusers'
    }
  });

module.exports = knex