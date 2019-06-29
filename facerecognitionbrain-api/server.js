const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
	client: 'pg',
	connection: {
	   host : '127.0.0.1',
	   user : 'postgres',
	   password : 'osama1995',
       database : 'postgres'
  }
})

console.log(db.select('*').from('users'));

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
	// res.send('this is working');
	db.select('*').from('users').then(data => {
		res.json(data)
	})
});

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});



app.listen(3000, () => {
	console.log('listening to port 3000');
})