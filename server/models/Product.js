const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        unit: {
            type: String,
            default: "Case"
        },

        price: {
            type: Number,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);