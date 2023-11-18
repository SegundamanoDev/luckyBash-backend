const mongoose = require("mongoose");

const EmailTemplate = new mongoose.Schema(
	{
		status: {type: String, require: true},
		subject: {type: String, require: true},
		content: {type: String, require: true},
	},
	{timestamps: true}
);

const Email = mongoose.model("Email", EmailTemplate);

module.exports = Email;
