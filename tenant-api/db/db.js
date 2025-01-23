const mongoose = require("mongoose");
let mongodbUrl = process.env.MODE == "prod" ? process.env.prodUrl : process.env.devUrl




//********************MONGOOSE CONNECTION*************************/

const connectToDatabase = async () => {
    try {
            await mongoose.connect(mongodbUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true, // Still recommended in some cases
        });
        console.log("Database is connected");
    } catch (err) {
        console.error("Error while connecting to the database:", err);
    }
};

connectToDatabase();

module.exports = mongoose;
