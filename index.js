import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { CommentController, PostController, UserController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { commentCreateValidation, loginValidation, postCreateValidation, registerValidation } from './validatiions.js';
import cors from 'cors';

const adminPass = process.env.ADMIN_PASS;

//подключение к бд
mongoose
	.connect(`mongodb+srv://admin:${adminPass}@cluster0.xn2zx35.mongodb.net/blog?retryWrites=true&w=majority`)
	.then(() => console.log('DB OK'))
	.catch(err => console.log('DB error', err));

const app = express(); // вся логика приложения хранится в этой переменной

// создаем хранилище для изображений
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage }); // создаем функцию которая будет хранить изображения в хранилище

app.use(express.json()); // позволяет читать json запросы
app.use(cors()); // разрешаем запросы с любого клиента(адрес)
app.use('/uploads', express.static('uploads')); // возвращение статических файлов

app.post('/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `uploads/${req.file.originalname}`,
	});
});

app.get('/posts', PostController.getAll);
app.get('/posts/popular', PostController.getPopular);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/byTag/:tag', PostController.getPostsByTag);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/posts/:id/createComment', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.get('/posts/:id/comments', CommentController.getCommentsByPost);

app.listen(4444, err => {
	if (err) {
		return console.log(err);
	}

	console.log('Server Ok');
}); // запуск сервера(нужно передать порт)
