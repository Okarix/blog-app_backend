export default (req, res, next) => {
	const token = req.headers.authorization;

	console.log(token);
	next();
};
