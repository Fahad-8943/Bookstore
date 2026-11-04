import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router";
import { getSingleBooksAPI, makePaymentAPI } from "../../services/allApi";
import axiosInstance from "../../api/axiosInstance";

function ViewBook() {
  const [showImages, setShowImages] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const res = await getSingleBooksAPI(id);
        if (res?.data) setBookDetails(res.data);
      } catch (error) {
        console.error("Unable to load book details", error);
      }
    };
    getBookDetails();
  }, [id]);

  const uploadedImages = (bookDetails?.uploadImages || [])
    .map((image) =>
      typeof image === "string"
        ? `${axiosInstance.defaults.baseURL}/uploads/${image}`
        : image?.url,
    )
    .filter(Boolean);
  const coverImage = bookDetails?.CoverImageUrl || uploadedImages[0];
  const formatPrice = (price) =>
    price == null || price === ""
      ? "—"
      : Number(price).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        });

  const makePayment = async () => {
    const res = await makePaymentAPI(id);
    console.log(res.data);
    if (res.status == 200) {
      const { checkoutURL } = res.data;
      window.location.href = checkoutURL;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <UserHeader />
      {!bookDetails ? (
        <p className="mx-auto mt-12 max-w-6xl px-4 text-center text-slate-600">
          Loading book details...
        </p>
      ) : (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
          <section className="grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 md:grid-cols-3">
            <div className="flex items-start justify-center rounded-xl bg-slate-50 p-5">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={`${bookDetails.title || "Book"} cover`}
                  className="h-80 w-56 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="flex h-80 w-56 items-center justify-center rounded-lg bg-slate-200 text-sm text-slate-500">
                  No cover image
                </div>
              )}
            </div>

            <div className="md:col-span-2 md:py-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                  {bookDetails.title || "Untitled book"}
                </h1>
                {uploadedImages.length > 0 && (
                  <button
                    type="button"
                    aria-label="View book photos"
                    title="View book photos"
                    onClick={() => setShowImages(true)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-indigo-600">
                {bookDetails.author || "Author not provided"}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p>
                    <span className="font-semibold text-slate-900">
                      Publisher:
                    </span>{" "}
                    {bookDetails.publisher || "—"}
                  </p>
                  <p className="mt-3 wrap-break-word">
                    <span className="font-semibold text-slate-900">
                      Seller Mail:
                    </span>{" "}
                    {bookDetails.sellerEmail || "—"}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold text-slate-900">
                      Language:
                    </span>{" "}
                    {bookDetails.language || "—"}
                  </p>
                  <p className="mt-3">
                    <span className="font-semibold text-slate-900">Price:</span>{" "}
                    {formatPrice(bookDetails.price)}
                  </p>
                  {bookDetails.discountPrice != null && (
                    <p className="mt-3">
                      <span className="font-semibold text-slate-900">
                        Discount price:
                      </span>{" "}
                      {formatPrice(bookDetails.discountPrice)}
                    </p>
                  )}
                </div>
                <div>
                  <p>
                    <span className="font-semibold text-slate-900">
                      No. of Pages:
                    </span>{" "}
                    {bookDetails.pages || "—"}
                  </p>
                  <p className="mt-3">
                    <span className="font-semibold text-slate-900">ISBN:</span>{" "}
                    {bookDetails.isbn || "—"}
                  </p>
                  <p className="mt-3">
                    <span className="font-semibold text-slate-900">
                      Category:
                    </span>{" "}
                    {bookDetails.category || "—"}
                  </p>
                </div>
              </div>

              <p className="mt-7 whitespace-pre-line text-sm leading-7 text-slate-600">
                {bookDetails.abstract || "No description provided."}
              </p>

              <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <Link to="/all-books">
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                  </button>
                </Link>
                <button
                  onClick={() => makePayment()}
                  className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Buy{" "}
                  {formatPrice(bookDetails.discountPrice ?? bookDetails.price)}
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {showImages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setShowImages(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-photos-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3
                id="book-photos-title"
                className="font-semibold text-slate-900"
              >
                Book Photos
              </h3>
              <button
                type="button"
                aria-label="Close book photos"
                onClick={() => setShowImages(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 text-sm text-slate-600">
              <FontAwesomeIcon icon={faCamera} />
              <p>Photos of {bookDetails?.title || "this book"}</p>
            </div>
            <div className="grid max-h-[calc(90vh-8rem)] grid-cols-1 gap-4 overflow-y-auto overscroll-contain px-5 pb-5 sm:grid-cols-2">
              {uploadedImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <img
                    src={image}
                    alt={`${bookDetails?.title || "Book"} photo ${index + 1}`}
                    className="max-h-72 w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewBook;
