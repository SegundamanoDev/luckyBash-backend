const jwt = require("jsonwebtoken");
const {errorHandler} = require("./handleError");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = function (req, res, next) {
	try {
		const token = req.headers.authorization;
		if (!token || !token.startsWith("Bearer")) {
			return next(errorHandler(404, "unauthorized, no token"));
		}
		const tokenValue = token.split(" ")[1];
		console.log(tokenValue);
		jwt.verify(tokenValue, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return next(errorHandler(401, "unauthorized, invalid token"));
			}
			req.user = user;
			next();
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

const admin = function (req, res, next) {
	verifyToken(req, res, function () {
		if (req.user?.role === "admin") {
			next();
		} else {
			res
				.status(401)
				.json({message: "authorization failed, you are not an admin"});
		}
	});
};

module.exports = {
	verifyToken,
	admin,
};
