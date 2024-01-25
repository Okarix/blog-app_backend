import bcrypt from 'bcrypt';
import 'dotenv/config';
import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';
import { registerValidation } from './validations/auth.js';

const adminPass = process.env.ADMIN_PASS;

mongoose
	.connect(`mongodb+srv://admin:${adminPass}@cluster0.xn2zx35.mongodb.net/blog?retryWrites=true&w=majority`)
	.then(() => console.log('DB OK'))
	.catch(err => console.log('DB error', err));

const app = express(); // вся логика приложения хранится в этой переменной

app.use(express.json()); // позволяет читать json запросы

app.post('/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req); // получаем все ошибки с регистрации
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		} // ошибки клиентской стороны

		const password = req.body.password; //получаем пароль
		const salt = await bcrypt.genSalt(10); // соль это алгоритм шифрования пароля
		const hash = await bcrypt.hash(password, salt); // шифруем пароль

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		}); // создаем модель пользователя для бд
		const user = await doc.save(); // сохраняем юзера в бд

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		); // Шифруем id в токен и срок на 30 дней

		const { passwordHash, ...userData } = user._doc; // деструктуризируем документ, чтобы создать объект без hash

		res.json({
			...userData,
			token,
		}); // возвращаем ответ
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to registration',
		});
	}
});

app.post('/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email }); //ищем пользователя по почте

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		} // если пользователь не найден

		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // сравниваем пароли

		if (!isValidPass) {
			return res.status(400).json({
				message: 'Wrong login or password',
			});
		} // если пароль неправильный

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{ expiresIn: '30d' }
		);

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to authorization',
		});
	}
});

app.get('/me', checkAuth, async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId); // ищем пользователя с таким id

		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			});
		}

		const { passwordHash, ...userData } = user._doc;

		res.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'No access',
		});
	}
});

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
