import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const adminPass = process.env.ADMIN_PASS;

mongoose
	.connect(`mongodb+srv://admin:${adminPass}@cluster0.xn2zx35.mongodb.net/?retryWrites=true&w=majority`)
	.then(() => console.log('DB OK'))
	.catch(err => console.log('DB error', err));

const app = express(); // вся логика приложения хранится в этой переменной

app.use(express.json()); // позволяет читать json запросы

app.post('/register', (req, res) => {});

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
