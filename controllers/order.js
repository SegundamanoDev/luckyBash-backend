const express = require("express");
const Order = require("../models/order");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const {verifyToken, admin} = require("../middleware/auth");
const Email = require("../models/mailTemplate");
const nodemailer = require("nodemailer");
const {errorHandler} = require("../middleware/handleError");

router.post(
	"/create-order",
	verifyToken,
	admin,
	async function (req, res, next) {
		try {
			const {
				senderName,
				senderContact,
				senderEmail,
				senderAddress,
				note,
				status,
				dispatchLocation,
				carrier,
				refNumber,
				weight,
				paymentMode,
				orderImg,
				receiverName,
				receiverContact,
				receiverEmail,
				receiverAddress,
				destination,
				packageDesc,
				dispatchDate,
				deliveryTime,
				deliveryDate,
				shipmentMode,
				quantity,
				currentLocation,
				updatedDate,
				updatedTime,
				latitude,
				longitude,
			} = req.body;

			if (orderImg) {
				const result = await cloudinary.uploader.upload(orderImg, {
					upload_preset: "segun",
				});

				const order = new Order({
					senderName,
					senderContact,
					senderEmail,
					senderAddress,
					note,
					status,
					dispatchLocation,
					carrier,
					refNumber,
					weight,
					paymentMode,
					orderImg: result,
					receiverName,
					receiverContact,
					receiverEmail,
					receiverAddress,
					destination,
					packageDesc,
					dispatchDate,
					deliveryDate,
					deliveryTime,
					shipmentMode,
					quantity,
					currentLocation,
					updatedDate,
					updatedTime,
					latitude,
					longitude,
				});

				if (!order) {
					return next(
						errorHandler(
							404,
							"internal server error, can not create order, try again"
						)
					);
				} else {
					const newOrder = await order.save();
					const msgTemp = await Email.findOne({status});

					const transporter = nodemailer.createTransport({
						service: process.env.NODEMAILER_SERVICE,
						auth: {
							user: process.env.NODEMAILER_USER,
							pass: process.env.NODEMAILER_PASS,
						},
					});

					const mailOptions = {
						from: process.env.NODEMAILER_USER,
						to: newOrder.receiverEmail,
						subject: msgTemp.subject,
						text: msgTemp.content,
					};
					await transporter.sendMail(mailOptions);

					res
						.status(201)
						.json({order: newOrder, message: "order have been created"});
				}
			}
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}
);

router.get("/orders", verifyToken, admin, async function (req, res, next) {
	try {
		console.log(req.headers);
		console.log("its here");
		const orders = await Order.find();

		if (!orders) {
			return next(errorHandler(404, "orders not found!"));
		}
		return res.status(200).json(orders);
	} catch (err) {
		console.log(err);
		return next(err);
	}
});

router.get("/order/:id", verifyToken, admin, async function (req, res, next) {
	try {
		console.log(req.headers);
		console.log(req.user);
		const order = await Order.findById(req.params.id);
		if (!order) {
			return next(errorHandler(404, "order not found!"));
		} else {
			return res.status(200).json(order);
		}
	} catch (err) {
		console.log(err);
		return next(err);
	}
});

router.put(
	"/update-order/:id",
	verifyToken,
	admin,
	async function (req, res, next) {
		try {
			const order = await Order.findById(req.params.id);
			if (!order) {
				return next(errorHandler(404, "order not found!"));
			}

			const msgTemp = await Email.findOne({status: order.status});

			const transporter = nodemailer.createTransport({
				service: process.env.NODEMAILER_SERVICE,
				auth: {
					user: process.env.NODEMAILER_USER,
					pass: process.env.NODEMAILER_PASS,
				},
			});

			const mailOptions = {
				from: process.env.NODEMAILER_USER,
				to: order.receiverEmail,
				subject: msgTemp.subject,
				text: msgTemp.content,
			};
			await transporter.sendMail(mailOptions);

			const newOrder = new Order({...req.body});
			const updatedOrder = await newOrder.save();
			res
				.status(201)
				.json({order: updatedOrder, message: "order have been created"});
		} catch (error) {
			return next(error);
		}
	}
);
router.delete(
	"/delete-order/:id",
	verifyToken,
	admin,
	async function (req, res, next) {
		try {
			const order = await Order.findByIdAndDelete(req.params.id);
			if (order) {
				return res.json({message: "order have been deleted!"});
			} else {
				return next(errorHandler(404, "order not found"));
			}
		} catch (err) {
			console.log(err);
			return next(err);
		}
	}
);
router.get("/track-order/:refNumber", async function (req, res, next) {
	try {
		const refNumberId = req.params.refNumber;
		const order = await Order.findOne({refNumber: refNumberId});
		if (!order) {
			return next(errorHandler(404, "order not found"));
		}
		return res.status(200).json(order);
	} catch (error) {
		console.log(error);
		return next(error);
	}
});

module.exports = router;
