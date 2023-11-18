const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {type: String, require: true},
		email: {type: String, require: true},
		password: {type: String, require: true},
		photo: {type: Object},
		resetPasswordToken: {type: String},
		resetPasswordTokenExpires: {type: Date},
		role: {type: String, enum: ["user", "admin"], default: "user"},
	},
	{timestamps: true}
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
