const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require('mysql')

const client = mysql.createConnection({
  host: 'db',
  user: 'root',
  database: 'nodedb',
  password: 'batata',
})

client.connect((err) => {
  if (!err) {
    client.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50))')
  } else {
    console.log("Batata -> ",err)
  }
})

app.get('/', (req, res) => {

  client.query('SELECT * FROM users', (err,rows,fields) => {
    let body = `
    <h1>FullCycle</h1>
    <form method="POST">
      <input type="text" name="name"/>
      <button>Salvar</button>
    </form>`
    rows.forEach(row => {
      body += `<p>${row.name}</p>`
    })
    res.send(body);
  })
});

app.post('/', (req, res) => {
  client.query(`INSERT INTO users(name) VALUES('${req.body.name}')`, (err, result) => {
    res.redirect('/')
  })
});

app.listen(3000, '0.0.0.0');
