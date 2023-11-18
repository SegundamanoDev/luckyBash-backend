const {default: mongoose} = require("mongoose");
const {insertEmailTemplate} = require("../controllers/email");
const dotenv = require("dotenv");
dotenv.config();

// const URL = process.env.MONGO_URL;
// const connectDB = async function () {
// 	await mongoose.connect(URL);
// 	console.log("mongoDB connected");
// };
// connectDB();

const templates = [
	{
		status: "Pending",
		subject: "Your Order Confirmation",
		content:
			"Thank you for your order! We've received it and are currently processing the details. You'll receive another update once your order is ready for shipment ",
	},
	{
		status: "Processing",
		subject: "Your Order is Being Prepared",
		content:
			"Exciting news! Your order is currently being prepared for shipment. We'll notify you once it's on its way to your doorstep ",
	},
	{
		status: "Shipped",
		subject: "Subject: Your Order Has Shipped!",
		content:
			"Great news! Your order has been shipped and is now on its way to you. You can track your delivery using the provided tracking information. ",
	},
	{
		status: "Out For Delivery",
		subject: "Your Order is Out for Delivery",
		content:
			"Get ready! Your order is currently out for delivery and will be arriving at your specified address soon. Keep an eye out for our delivery team!",
	},
	{
		status: "Delivered",
		subject: "Your Order Has Been Delivered",
		content:
			"Fantastic news! Your order has been successfully delivered. We hope you enjoy your purchase. If you have any feedback, feel free to let us know!",
	},
	{
		status: "On Hold",
		subject: "Order Status Update",
		content:
			"We wanted to update you that your order is currently on hold. Our team will reach out to you shortly to discuss the details and provide assistance.",
	},
	{
		status: "Cancelled",
		subject: "Order Cancellation Notice",
		content:
			"We regret to inform you that your order has been canceled. If you have any questions or concerns, please reach out to our customer support team for assistance.",
	},
];

insertEmailTemplate(templates)
	.then(() => {
		console.log("seed data inserted");
	})
	.catch((error) => {
		console.log(error);
	})
	.finally(() => {
		mongoose.disconnect();
	});

module.exports = templates;
