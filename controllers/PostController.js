import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.reverse()
			.slice(0, 5);

		res.json(tags);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get tags',
		});
	}
};

export const getPostsByTag = async (req, res) => {
	try {
		const tag = req.params.tag;

		const posts = await PostModel.find({ tags: tag })
			.populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
			.sort({ createdAt: -1 })
			.exec();
		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get posts',
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

export const getPopular = async (req, res) => {
	try {
		const posts = await PostModel.aggregate([
			{
				$addFields: {
					viewedByCount: { $size: '$viewedBy' },
				},
			},
			{
				$sort: { viewedByCount: -1 },
			},
			{
				$lookup: {
					from: 'users', // assuming your users collection name is "users"
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$project: {
					title: 1,
					text: 1,
					tags: 1,
					viewedBy: 1,
					user: { $arrayElemAt: ['$user', 0] },
					imageUrl: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
		]);

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
		const userId = req.query.viewed;

		// Проверить, уже ли пользователь просматривал пост
		const post = await PostModel.findById(postId).populate({ path: 'user', select: ['fullName', 'avatarUrl'] });
		if (post.viewedBy.includes(userId)) {
			return res.json(post); // Не увеличивать просмотры, если уже просмотрено
		}

		// Обновляем число просмотров и добавляем ID пользователя в список просмотревших,
		// только если пользователь еще не просматривал этот пост
		const updatedPost = await PostModel.findByIdAndUpdate(
			postId,
			{
				$addToSet: { viewedBy: userId }, // Добавить ID пользователя в список просмотревших, если его там еще нет
			},
			{ new: true } // чтобы получить обновленный документ после обновления
		);

		if (!updatedPost) {
			return res.status(404).json({
				message: 'Post not found',
			});
		}

		res.json(updatedPost);
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
				// $inc: { viewsCount: -1 },
				$set: {
					title: req.body.title,
					text: req.body.text,
					tags: req.body.tags.split(', '),
					user: req.userId,
					imageUrl: req.body.imageUrl,
				},
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
