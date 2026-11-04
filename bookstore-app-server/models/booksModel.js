const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
    default: "",
  },
  language: {
    type: String,
    trim: true,
    default: "",
  },
  isbn: {
    type: String,
    trim: true,
    default: "",
  },
  category: {
    type: String,
    trim: true,
    default: "",
  },
  abstract: {
    type: String,
    trim: true,
    default: "",
  },
  pages: {
    type: Number,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number,
    min: 0,
  },
  CoverImageUrl: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "sold"],
    default: "pending",
  },
  sellerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  uploadImages: {
    type: Array,
    required: true,
  },
  buyerEmail: {
    type: String,
    default: "",
  },
});

const books = mongoose.model("books", bookSchema);
module.exports = books;
