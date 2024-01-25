import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import checkAuth from './utils/checkAuth.js';
import { registerValidation } from './validations/auth.js';

import * as UserController from './controllers/UserController.js';

const adminPass = process.env.ADMIN_PASS;
mongoose
	.connect(`mongodb+srv://admin:${adminPass}@cluster0.xn2zx35.mongodb.net/blog?retryWrites=true&w=majority`)
	.then(() => console.log('DB OK'))
	.catch(err => console.log('DB error', err));

const app = express(); // вся логика приложения хранится в этой переменной

app.use(express.json()); // позволяет читать json запросы

app.post('/register', registerValidation, UserController.register);

app.post('/login', UserController.login);

app.get('/me', checkAuth, UserController.getMe);

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
