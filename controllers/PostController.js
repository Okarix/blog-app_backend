import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
			.exec(); // ищем все статьи пользователя и связываемся с бд для этого и выполняем

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get posts',
		});
	}
};

export const getOne = (req, res) => {
	try {
		const postId = req.params.id; // получаем id статьи из параметров

		// находим одну статью и обновляем в ней число просмотров
		PostModel.findOneAndUpdate(
			{
				_id: postId, // получаем id
			},
			{
				$inc: { viewsCount: 1 }, // инкрементируем число просмотров
			},
			{
				returnDocument: 'after', // возвращаем измененный документ
			}
		).then(
			(doc, err) => {
				if (err) {
					console.log(err);
					return res.status(500).json({
						message: 'Failed to get post',
					});
				}

				if (!doc) {
					return res.status(404).json({
						message: 'Post not found',
					});
				}

				res.json(doc);
			} // проверка если есть ошибки, нет документа и если все норм
		);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get post',
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			viewsCount: req.body.viewsCount,
			user: req.userId,
			imageUrl: req.body.imageUrl,
		}); // создаем документ в модели статьи

		const post = await doc.save(); // сохраняем документ в бд

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to create post',
		});
	}
};
