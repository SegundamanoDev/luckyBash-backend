const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
	{
		senderName: {type: String, require: true},
		senderContact: {type: String, require: true},
		senderEmail: {type: String, require: true},
		senderAddress: {type: String, require: true},
		note: {type: String, require: true},
		status: {type: String, require: true},
		dispatchLocation: {type: String, require: true},
		carrier: {type: String, require: true},
		refNumber: {type: String, require: true},
		weight: {type: String, require: true},
		paymentMode: {type: String, require: true},
		orderImg: {type: Object},
		receiverName: {type: String, require: true},
		receiverContact: {type: String, require: true},
		receiverEmail: {type: String, require: true},
		receiverAddress: {type: String, require: true},
		destination: {type: String, require: true},
		packageDesc: {type: String, require: true},
		deliveryDate: {type: String, require: true},
		dispatchDate: {type: String, require: true},
		deliveryTime: {type: String, require: true},
		shipmentMode: {type: String, require: true},
		quantity: {type: String, require: true},
		currentLocation: {type: String},
		updatedDate: {type: String},
		updatedTime: {type: String},
		deliveryCharges: {type: String},
		totalCharges: {type: String},
		deliveryNote: {type: String},
		latitude: {type: String},
		longitude: {type: String},
	},
	{timestamps: true}
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
