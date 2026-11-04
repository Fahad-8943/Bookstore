const books = require("../models/booksModel");
const mongoose = require("mongoose");

const stripe = require("stripe")(process.env.STRIPEKEY);

exports.addBookController = async (req, res) => {
  console.log("inside add book controller");

  const {
    title,
    author,
    publisher,
    language,
    isbn,
    category,
    abstract,
    pages,
    price,
    discountPrice,
    CoverImageUrl,
  } = req.body;

  const uploadImages = req.files.map((file) => file.filename);

  const sellerEmail = req.payload.userEmail;

  console.log(
    title,
    author,
    publisher,
    language,
    isbn,
    category,
    abstract,
    pages,
    price,
    discountPrice,
    CoverImageUrl,
    uploadImages,
    sellerEmail,
  );

  const existingBook = await books.findOne({ title, sellerEmail });
  if (existingBook) {
    res.status(409).json("Book already exist..... operation denied");
  } else {
    const newBook = await books.create({
      title,
      author,
      publisher,
      language,
      isbn,
      category,
      abstract,
      pages,
      price,
      discountPrice,
      CoverImageUrl,
      uploadImages,
      sellerEmail,
    });
    res.status(200).json(newBook);
  }
};

exports.getHomePageBookController = async (req, res) => {
  console.log("Inside getHomePageBookController");

  const homeBooks = await books.find().sort({ _id: -1 }).limit(4);
  res.status(200).json(homeBooks);
};

exports.getAllBookController = async (req, res) => {
  console.log("inside getAllBookController");
  const loginUserMail = req.payload.userEmail;
  const searchKey = req.query.search;
  const allBooks = await books.find({
    sellerEmail: { $ne: loginUserMail },
    title: { $regex: searchKey, $options: "i" },
  });
  res.status(200).json(allBooks);
};

// get user uploaded books
exports.getUsersBookController = async (req, res) => {
  console.log("inside getLoginUsersBookController");
  const loginUserMail = req.payload.userEmail;
  const allBooks = await books.find({ sellerEmail: { $eq: loginUserMail } });
  res.status(200).json(allBooks);
};

// get user uploaded books
exports.getUserBoughtsBookController = async (req, res) => {
  console.log("inside getLoginUsersBookController");
  const loginUserMail = req.payload.userEmail;
  const allBooks = await books.find({ buyerEmail: { $eq: loginUserMail } });
  res.status(200).json(allBooks);
};

exports.getSingleBookController = async (req, res) => {
  console.log("inside getSingleBookController");
  const { id } = req.params;
  const bookDetails = await books.findById({ _id: id });
  res.status(200).json(bookDetails);
};

// remove books
exports.removeBookController = async (req, res) => {
  console.log("inside removeBookController");
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  const deletedBook = await books.findOneAndDelete({
    _id: id,
    sellerEmail: req.payload.userEmail.toLowerCase(),
  });
  if (!deletedBook) {
    return res.status(404).json({
      message: "Book not found or you do not have permission to delete it.",
    });
  }

  return res.status(200).json({ message: "Book removed successfully." });
};
// make payment
exports.bookPaymentController = async (req, res) => {
  console.log("Inside bookPaymentController");
  const { id } = req.params;
  const loginUserEmail = req.payload.userEmail.toLowerCase();
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  const bookDetails = await books.findById(id);
  if (!bookDetails) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (bookDetails.status === "sold") {
    return res
      .status(409)
      .json({ message: "This book has already been sold." });
  }
  if (bookDetails.sellerEmail.toLowerCase() === loginUserEmail) {
    return res.status(403).json({ message: "You cannot buy your own book." });
  }

  const price = Number(bookDetails.discountPrice ?? bookDetails.price);
  const unitAmount = Math.round(price * 100);
  if (!Number.isFinite(price) || price <= 0 || unitAmount <= 0) {
    return res.status(400).json({ message: "This book has an invalid price." });
  }

  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(
    /\/$/,
    "",
  );
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: bookDetails.title,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      bookId: id,
      buyerEmail: loginUserEmail,
    },
    success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/cancel`,
  });
  console.log(session);
  return res.status(200).json({ checkoutURL: session.url });
};

exports.verifyPaymentController = async (req, res) => {
  console.log("inside verifyPaymentController");
  const { sessionId } = req.body;
  if (typeof sessionId !== "string" || !sessionId) {
    return res
      .status(400)
      .json({ message: "A valid Stripe session ID is required." });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (
    session.payment_status === "paid" &&
    session.mode === "payment" &&
    session.metadata?.bookId &&
    session.metadata?.buyerEmail
  ) {
    const bookId = session.metadata.bookId;
    const email = session.metadata.buyerEmail.toLowerCase();
    if (!mongoose.isValidObjectId(bookId)) {
      return res
        .status(400)
        .json({ message: "Invalid book ID in payment session." });
    }
    if (email !== req.payload.userEmail.toLowerCase()) {
      return res
        .status(403)
        .json({ message: "This payment belongs to another user." });
    }

    const book = await books.findOneAndUpdate(
      { _id: bookId, status: { $ne: "sold" } },
      { $set: { status: "sold", buyerEmail: email } },
      { new: true },
    );
    if (book) {
      return res.status(200).json({ message: "Payment verified.", book });
    }

    const alreadyPurchasedBook = await books.findOne({
      _id: bookId,
      status: "sold",
      buyerEmail: email,
    });
    if (alreadyPurchasedBook) {
      return res
        .status(200)
        .json({ message: "Payment verified.", book: alreadyPurchasedBook });
    }

    return res.status(409).json({
      message: "This book is no longer available for this payment.",
    });
  }

  return res.status(400).json({ message: "Payment not completed." });
};

exports.adminGetAllBookController = async (req, res) => {
  console.log("inside getAllBookController");
  const allBooks = await books.find();
  res.status(200).json(allBooks);
};

exports.approveBooksController = async (req, res) => {
  console.log("inside approveBooksController");

  const { id } = req.params;
  const book = await books.findByIdAndUpdate(
    id,
    { status: "approved" },
  );
  if (!book) return res.status(404).json({ message: "Book not found." });
  return res.status(200).json(book);
};
