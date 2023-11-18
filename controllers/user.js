const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const express = require("express");
const {errorHandler} = require("../middleware/handleError");
const router = express.Router();

router.post("/register", async function (req, res, next) {
	try {
		const {username, email, password, photo} = req.body;
		if (photo) {
			const result = await cloudinary.uploader.upload(photo, {
				upload_preset: "segun",
			});
			if (result) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(password, salt);
				const user = new User({username, email, password: hash, photo: result});
				const newUser = await user.save();
				if (newUser) {
					return res.status(201).json({message: "registration successful"});
				} else {
					return next(
						errorHandler(500, "internal server error, failed to register user")
					);
				}
			} else {
				return next(errorHandler(500, "failed to upload photo to cloudinary"));
			}
		}
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.post("/login", async function (req, res, next) {
	try {
		const {email, password} = req.body;

		const user = await User.findOne({email});
		if (!user) return next(errorHandler(404, "User not found"));

		const comparePassword = await bcrypt.compare(password, user.password);
		if (!comparePassword) return next(errorHandler(404, "Invalid password"));

		const token = jwt.sign(
			{id: user._id, email: user.email},
			process.env.JWT_SECRET
		);
		console.log(req.headers);
		return res.status(200).json({user: user, token: token});
	} catch (err) {
		console.error(err);
		return next(err);
	}
});

router.put("/forgot-password", async function (req, res, next) {
	try {
		const {email} = req.body;

		const user = await User.findOne({email});
		if (!user) {
			return next(errorHandler(404, "user does not exist"));
		}

		const token = crypto.randomBytes(20).toString("hex");
		const tokenExpires = new Date();
		tokenExpires.setMinutes(tokenExpires.getMinutes() + 1);

		user.resetPasswordToken = token;
		user.resetPasswordTokenExpires = tokenExpires;
		await user.save();

		const baseUrl = `http://localhost:3000/reset-password/${token}`;

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_PASS,
			},
		});

		const mailOptions = {
			from: process.env.NODEMAILER_USER,
			to: user.email,
			subject: "Password Reset",
			text: `${baseUrl}`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent", info);

		res
			.status(200)
			.json({message: "reset password link have been sent to your email"});
	} catch (err) {
		next(err);
	}
});

router.put("/reset-password/:token", async function (req, res, next) {
	try {
		const token = req.params.token;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpires: {$gt: Date.now()},
		});

		if (!user) {
			return next(errorHandler(404, "invalid or expired token"));
		}
		const {newPassword, confirmedPassword} = req.body;

		if (newPassword === user.password) {
			return next(
				errorHandler(
					500,
					"current password must not be the same as old Password"
				)
			);
		}

		if (newPassword !== confirmedPassword) {
			return next(errorHandler(500, "password does not matched"));
		}

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);

		user.password = hash;
		user.resetPasswordToken = null;
		user.resetPasswordTokenExpires = null;

		await user.save();

		res.status(200).json({message: "password has been reset!"});
	} catch (err) {
		next(err);
		console.log(err.stack);
	}
});

module.exports = router;
