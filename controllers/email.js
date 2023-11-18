const Email = require("../models/mailTemplate");

const insertEmailTemplate = async function (templates) {
	try {
		return await Email.insertMany(templates);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
const getTemplateByStatus = async (status) => {
	try {
		return await Email.findOne({status});
	} catch (error) {
		console.error("Error retrieving template");
		throw error;
	}
};

module.exports = {insertEmailTemplate, getTemplateByStatus};
