import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const adminPass = process.env.ADMIN_PASS;

mongoose
	.connect(`mongodb+srv://admin:${adminPass}@cluster0.xn2zx35.mongodb.net/?retryWrites=true&w=majority`)
	.then(() => console.log('DB OK'))
	.catch(err => console.log('DB error', err));

const app = express(); // вся логика приложения хранится в этой переменной

app.use(express.json()); // позволяет читать json запросы

app.get('/', (req, res) => {
	res.send('Hello world');
}); // ответ на гет запрос

app.post('/login', (req, res) => {
	console.log(req.body);

	if (req.body.email === 'test@gmail.com') {
		const token = jwt.sign(
			{
				email: req.body.email,
				fullName: 'Бека Беков',
			},
			'secret123'
		); //генерируем токен(внутри же шифруем)
		res.json({
			success: true,
			token,
		});
	} else {
		res.json({
			error: 'Incorrect email format',
		});
	}
});

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
