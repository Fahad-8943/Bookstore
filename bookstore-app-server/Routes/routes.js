const express = require("express");
const userController = require("../Controller/userController");
const multerMiddleware = require("../middlewares/multerMiddileware");
const authMiddleWare = require("../middlewares/authMiddleware");
const bookController = require("../Controller/bookController");
const adminAuthMiddleWare = require("../middlewares/adminAuthMiddleware");

// to set up routes outside express server , create object for routes class in ecpress

const router = new express.Router();

//register
router.post("/register", userController.registerController);
//login
router.post("/login", userController.loginController);
router.post("/google-login", userController.googleLoginController);

// get home page books
router.get("/home-books", bookController.getHomePageBookController);

// update
router.put(
  "/user/edit/:id",
  authMiddleWare,
  multerMiddleware.single("picture"),
  userController.userEditController,
);

// user book adding
router.post(
  "/add-book",
  authMiddleWare,
  multerMiddleware.array("uploadImages", 3),
  bookController.addBookController,
);
// get all books
router.get("/all-books", authMiddleWare, bookController.getAllBookController);
// get user books
router.get(
  "/user-books",
  authMiddleWare,
  bookController.getUsersBookController,
);
// get buyer books
router.get(
  "/bought-books",
  authMiddleWare,
  bookController.getUserBoughtsBookController,
);
router.get(
  "/single-book/:id",
  authMiddleWare,
  bookController.getSingleBookController,
);

router.delete(
  "/remove-book/:id",
  authMiddleWare,
  bookController.removeBookController,
);

router.get(
  "/make-payment/:id",
  authMiddleWare,
  bookController.bookPaymentController,
);

router.post(
  "/verify-payment",
  authMiddleWare,
  bookController.verifyPaymentController,
);

// ------------------admin----------------------

router.get(
  "/books",
  adminAuthMiddleWare,
  bookController.adminGetAllBookController,
);
router.put(
  "/book-update/:id",
  adminAuthMiddleWare,
  bookController.approveBooksController,
);

router.get(
  "/all-users",
  adminAuthMiddleWare,
  userController.getAllUserController,
);

module.exports = router;
