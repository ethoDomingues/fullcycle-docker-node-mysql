const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pg = require('pg')
const { Client } = pg

const client = new Client({
  user: 'batata',
  host: 'db',
  database: 'nodedb',
  password: 'batata',
  port: 5432,
})

client.connect((err) => {
  if (!err) {
    client.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50))')
  } else {
    console.log(err)
  }
})
app.get('/', (req, res) => {
  let r = [];
  client.query('SELECT * FROM users').then(result => {
    r = result.rows
  }).then(() => {
    let body = `
<h1>FullCycle</h1>
<form method="POST">
  <input type="text" name="name"/>
  <button>Salvar</button>
</form>
`
    r.forEach(row => {
      body += `<p>${row.name}</p>`
    })
    res.send(body);
  })
});

app.post('/', (req, res) => {
  client.query('INSERT INTO users(name) VALUES($1)', [req.body.name]).then(r => {
    res.redirect('/')
  })
});

app.listen(3000, '0.0.0.0');
