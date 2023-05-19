const fs = require("fs");
const express = require("express");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load env
require("dotenv").config();

app.get("/bfhl", async (req, res) => {
    try {
        const operation_code = JSON.parse(
            fs.readFileSync("./operation.json")
        ).operation_code;
        return res.status(200).json({
            operation_code,
        });
    } catch (err) {
        return res.status(500).json({
            error: err ? err : "Internal Server Error",
        });
    }
});

app.post("/bfhl", async (req, res) => {
    // my info
    const user_id = "divyanshu_kaushik_26082002";
    const email = "dk6857@srmist.edu.in";
    const roll_number = "RA2011003010819";

    // data
    let alphabets = [];
    let numbers = [];
    success = false;

    // read json file and update operation code
    let operation_code = JSON.parse(
        fs.readFileSync("./operation.json")
    ).operation_code;
    operation_code += 1;
    fs.writeFileSync("./operation.json", JSON.stringify({ operation_code }));

    try {
        const { data } = req.body;
        await data.forEach((item) => {
            if (validator.isAlpha(item)) alphabets.push(item);
            else if (validator.isNumeric(item)) numbers.push(item);
            else throw new Error("Invalid Data");
        });
        return res.status(200).json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            is_success: false,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
        });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
