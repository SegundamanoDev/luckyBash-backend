const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
});

const sendEmail = async (userEmail, option) => {
	const mailOptions = {
		from: process.env.NODEMAILER_USER,
		to: userEmail,
		subject: option.subject,
		text: option.content,
	};

	const info = await transporter.sendMail(mailOptions);
	console.log("Email sent", info);
};

module.exports = {sendEmail};
