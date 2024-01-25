import jwt from 'jsonwebtoken';

export default (req, res, next) => {
	// если пришел токен или нет, то мы получаем строчку с удалением bearer
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decoded = jwt.verify(token, 'secret123'); // расшифровываем токен

			req.userId = decoded._id; // сохраняем id в req
			next(); // выполнение след части
		} catch (err) {
			return res.status(403).send({
				message: 'No access',
			});
		}
	} else {
		return res.status(403).json({
			message: 'No access',
		});
	}
};
