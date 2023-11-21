const jwt = require("jsonwebtoken");
const {errorHandler} = require("./handleError");
const dotenv = require("dotenv");
const User = require("../models/user");
dotenv.config();

const verifyToken = async function (req, res, next) {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id);
			next();
		} catch (error) {
			console.log(error);
			return next(errorHandler(401, "unauthorized, invalid token"));
		}
	}
	if (!token) {
		return next(errorHandler(401, "unauthorized, no token"));
	}
};

const admin = async function (req, res, next) {
	try {
		verifyToken(req, res, () => {
			if (req.user && req.user.role === "admin") {
				next();
			} else {
				return next(errorHandler(401, "unauthorized, you are not an admin"));
			}
		});
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	verifyToken,
	admin,
};
