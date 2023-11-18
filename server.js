const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./controllers/user");
const orderRoute = require("./controllers/order");
// const cookieParser = require('cookie-parser')
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use(morgan("dev"));
app.use(userRoute);
app.use(orderRoute);

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(err.status).json({
		success: false,
		message: err.message,
	});
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`server is running on ${port}`);
});

const URL = process.env.MONGO_URL;
const connectDB = async function () {
	await mongoose.connect(URL);
	console.log("mongoDB connected");
};
connectDB();
