const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "drbmsencj",
	api_key: "837296727223186",
	api_secret: "vi293kFCHdK7pysDIzbKjNCOuhg",
});

module.exports = cloudinary;
