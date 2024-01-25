import express from 'express';

const app = express(); // вся логика приложения хранится в этой переменной

app.get('/', (req, res) => {
	res.send('Hello');
}); // ответ на гет запрос

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
