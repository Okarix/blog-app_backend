import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get tags',
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
			.sort({ createdAt: -1 })
			.exec(); // ищем все статьи пользователя и связываемся с бд для этого и выполняем

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get posts',
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id; // получаем id статьи из параметров

		// находим одну статью и обновляем в ней число просмотров
		await PostModel.findOneAndUpdate(
			{
				_id: postId, // получаем id
			},
			{
				$inc: { viewsCount: 1 }, // инкрементируем число просмотров
			},
			{
				returnDocument: 'after', // возвращаем измененный документ
			}
		)
			.populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
			.then(
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
			tags: req.body.tags.split(', '),
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

export const remove = async (req, res) => {
	try {
		const postId = req.params.id; // получаем id статьи из параметров

		await PostModel.findOneAndDelete({
			_id: postId,
		}).then((doc, err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					message: 'Failed to delete post',
				});
			}

			if (!doc) {
				return res.status(404).json({
					message: 'Failed to find post ',
				});
			}

			res.json({
				success: true,
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to delete post',
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id; // получаем id статьи из параметров

		await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags.split(', '),
				user: req.userId,
				imageUrl: req.body.imageUrl,
			}
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to update post',
		});
	}
};
