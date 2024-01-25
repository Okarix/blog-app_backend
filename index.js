import 'dotenv/config';
import express from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import { registerValidation } from './validations/auth.js';

const adminPass = process.env.ADMIN_PASS;

mongoose
	.connect(`mongodb+srv://admin:${adminPass}@cluster0.xn2zx35.mongodb.net/?retryWrites=true&w=majority`)
	.then(() => console.log('DB OK'))
	.catch(err => console.log('DB error', err));

const app = express(); // вся логика приложения хранится в этой переменной

app.use(express.json()); // позволяет читать json запросы

app.post('/register', registerValidation, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	const doc = new UserModel({
		email: req.body.email,
		fullName: req.body.fullName,
		passwordHash: req.body.password,
		avatarUrl: req.body.avatarUrl,
	});

	res.json({
		success: true,
	});
});

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
