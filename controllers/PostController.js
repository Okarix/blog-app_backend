import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find()
			.populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
			.exec();

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to get posts',
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
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Failed to create post',
		});
	}
};
