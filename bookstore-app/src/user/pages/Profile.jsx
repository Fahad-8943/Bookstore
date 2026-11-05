import { useEffect, useRef, useState } from "react";
import UserHeader from "../components/UserHeader";
import {
  faBookOpen,
  faUser,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../api/axiosInstance";
import {
  addBookAPI,
  bookAbstractAPI,
  getBoughtBooksAPI,
  getUserBooksAPI,
  removeBookAPI,
} from "../../services/allApi";
import { toast } from "react-toastify";
import EditProfile from "../components/EditProfile";
import useDebounce from "../../hooks/useDebounce";

function Profile() {
  const [sellBookStatus, setSellBookStatus] = useState(true);
  const [bookStatus, setBookStatus] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [bookAbstract, setBookAbstract] = useState("");
  const [isGeneratingAbstract, setIsGeneratingAbstract] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploadedImagePreviews, setUploadedImagePreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const uploadInputRef = useRef(null);
  const [uploadedBooks, setUploadedBooks] = useState([]);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [isLoadingUploadedBooks, setIsLoadingUploadedBooks] = useState(true);
  const [uploadedBooksLoadFailed, setUploadedBooksLoadFailed] = useState(false);
  const [boughtBooks, setBoughtBooks] = useState([]);
  const [isLoadingBoughtBooks, setIsLoadingBoughtBooks] = useState(true);
  const [boughtBooksLoadFailed, setBoughtBooksLoadFailed] = useState(false);

  const debouncedTitleSearch = useDebounce(bookTitle, 500);
  const hasDuplicateTitle =
    debouncedTitleSearch.trim() !== "" &&
    uploadedBooks.some(
      (book) => book.title.trim() === debouncedTitleSearch.trim(),
    );

  const clearBookForm = (form) => {
    form.reset();
    setBookTitle("");
    setBookAbstract("");
    setCoverImageUrl("");
    uploadedImages.forEach(({ url }) => URL.revokeObjectURL(url));
    setUploadedImages([]);
    setUploadedImagePreviews([]);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  };

  useEffect(() => {
    const title = debouncedTitleSearch.trim();
    if (!title) {
      setBookAbstract("");
      setIsGeneratingAbstract(false);
      return;
    }

    let isCurrentRequest = true;
    setIsGeneratingAbstract(true);

    const generateBookAbstract = async () => {
      try {
        const response = await bookAbstractAPI(title);
        if (isCurrentRequest) {
          setBookAbstract(response.data.content);
        }
      } catch (error) {
        if (isCurrentRequest) {
          toast.error(
            error?.response?.data?.message ||
              "Could not generate the book abstract.",
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsGeneratingAbstract(false);
        }
      }
    };

    generateBookAbstract();
    return () => {
      isCurrentRequest = false;
    };
  }, [debouncedTitleSearch]);

  useEffect(() => {
    const syncUser = () => {
      try {
        const savedUser = JSON.parse(sessionStorage.getItem("user") || "null");
        setUser(savedUser);
      } catch {
        sessionStorage.removeItem("user");
        setUser(null);
      }
    };
    syncUser();
    getUserBooksAPI()
      .then((res) => {
        if (res.status === 200) {
          setUploadedBooks(res.data);
        } else {
          setUploadedBooksLoadFailed(true);
          toast.error("Could not load your uploaded books.");
        }
      })
      .catch(() => {
        setUploadedBooksLoadFailed(true);
        toast.error("Could not load your uploaded books.");
      })
      .finally(() => setIsLoadingUploadedBooks(false));
    getBoughtBooksAPI()
      .then((res) => {
        if (res.status === 200) {
          setBoughtBooks(res.data);
        } else {
          setBoughtBooksLoadFailed(true);
          toast.error("Could not load your purchased books.");
        }
      })
      .catch(() => {
        setBoughtBooksLoadFailed(true);
        toast.error("Could not load your purchased books.");
      })
      .finally(() => setIsLoadingBoughtBooks(false));
    window.addEventListener("auth-change", syncUser);
    return () => window.removeEventListener("auth-change", syncUser);
  }, []);

  const profileImage = user?.picture
    ? user.picture.startsWith("http")
      ? user.picture
      : `${axiosInstance.defaults.baseURL}/uploads/${user.picture.replace(/^\/+/, "").replace(/^uploads\//, "")}`
    : "";

  const handleProfileSaved = (updatedUser) => {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowEditProfile(false);
    window.dispatchEvent(new Event("auth-change"));
  };

  const handleAddBook = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const requiredFields = Array.from(form.querySelectorAll("[required]"));
    if (requiredFields.some((field) => !field.value.trim())) {
      toast.error("Please fill in every book detail before submitting.");
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one book image before submitting.");
      return;
    }

    setIsAddingBook(true);
    const formData = new FormData(form);
    uploadedImages.forEach(({ file }) => formData.append("uploadImages", file));
    try {
      const response = await addBookAPI(formData);
      if (response?.status >= 200 && response?.status < 300) {
        toast.success("Book added successfully.");
        setUploadedBooks((currentBooks) => [response.data, ...currentBooks]);
        clearBookForm(form);
      } else {
        toast.error(
          response?.response?.data?.message ||
            (typeof response?.response?.data === "string"
              ? response.response.data
              : "") ||
            "Could not add the book. Please try again.",
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (typeof error?.response?.data === "string"
            ? error.response.data
            : "") ||
          "Could not add the book. Please try again.",
      );
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleImageSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const availableSlots = 3 - uploadedImages.length;
    if (selectedFiles.length > availableSlots) {
      toast.warning(
        availableSlots === 0
          ? "You can upload a maximum of 3 images. Remove an image before adding another."
          : `You can add ${availableSlots} more image${availableSlots === 1 ? "" : "s"}. Select 3 images or fewer in total.`,
      );
      event.target.value = "";
      return;
    }
    const nextFiles = selectedFiles.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setUploadedImages((current) => [...current, ...nextFiles]);
    setUploadedImagePreviews((current) => [...current, ...nextFiles]);
    event.target.value = "";
  };

  const handleRemoveImage = (imageUrl) => {
    const image = uploadedImages.find((item) => item.url === imageUrl);
    if (image) URL.revokeObjectURL(image.url);
    setUploadedImages((current) =>
      current.filter((item) => item.url !== imageUrl),
    );
    setUploadedImagePreviews((current) =>
      current.filter((item) => item.url !== imageUrl),
    );
  };

  const removeBook = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingBookId(id);
    try {
      const response = await removeBookAPI(id);
      if (response?.status >= 200 && response?.status < 300) {
        setUploadedBooks((currentBooks) =>
          currentBooks.filter((book) => book._id !== id),
        );
        toast.success("Book removed successfully.");
      } else {
        const errorData = response?.response?.data;
        toast.error(
          errorData?.message ||
            (typeof errorData === "string" ? errorData : "") ||
            "Could not remove the book. Please try again.",
        );
      }
    } catch (error) {
      const errorData = error?.response?.data;
      toast.error(
        errorData?.message ||
          (typeof errorData === "string" ? errorData : "") ||
          "Could not remove the book. Please try again.",
      );
    } finally {
      setDeletingBookId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UserHeader />

      {/* Profile Header */}
      <div className="relative">
        {/* Blue Cover */}
        <div className="h-50 w-full bg-blue-950"></div>

        {/* White Profile Area */}
        <div className="h-65 w-full bg-white"></div>

        {/* Profile Image */}
        <div className="absolute left-10 top-25 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-white shadow-lg">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="text-8xl text-gray-500" />
          )}
        </div>

        {/* User Information */}
        <div className="absolute left-65 top-52">
          <h1 className="text-2xl font-bold">{user?.username}</h1>

          <p className="mt-2 max-w-xl text-gray-600">{user?.bio}</p>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setShowEditProfile(true)}
          className="absolute bottom-8 right-10 flex items-center gap-2 rounded-md bg-blue-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          Edit Profile
        </button>
      </div>

      {showEditProfile && (
        <EditProfile
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSaved={handleProfileSaved}
        />
      )}

      <div className="flex items-center justify-center">
        <p
          onClick={() => {
            setSellBookStatus(true);
            setBookStatus(false);
            setPurchaseStatus(false);
          }}
          className={
            sellBookStatus
              ? "text-blue-700 px-3 border-gray-400 border-t border-l rounded-t  border-r"
              : "text-black px-3 border-gray-400 border-b"
          }
        >
          Sell Book
        </p>
        <p
          onClick={() => {
            setSellBookStatus(false);
            setBookStatus(true);
            setPurchaseStatus(false);
          }}
          className={
            bookStatus
              ? "text-blue-700 px-3 border-gray-400 border-t border-l border-r rounded-t "
              : "text-black px-3 border-gray-400 border-b"
          }
        >
          Book Status
        </p>
        <p
          onClick={() => {
            setSellBookStatus(false);
            setBookStatus(false);
            setPurchaseStatus(true);
          }}
          className={
            purchaseStatus
              ? "text-blue-700 px-3 border-gray-400 border-t border-l rounded-t  border-r"
              : "text-black px-3 border-gray-400 border-b "
          }
        >
          Purchase Status
        </p>
      </div>

      {sellBookStatus && (
        <div className="mx-2 mb-12 mt-8 rounded-2xl bg-blue-900 p-5 text-white shadow md:mx-auto md:w-[70%] md:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Book Details</h2>
            <p className="mt-2 text-sm text-blue-100">
              Add the details of the book you want to sell.
            </p>
          </div>

          <form onSubmit={handleAddBook}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                ["Title", "Book title", "text"],
                ["Author", "Author name", "text"],
                ["Publisher", "Publisher", "text"],
                ["Language", "e.g. English", "text"],
                ["ISBN", "ISBN number", "text"],
                ["Category", "e.g. Fiction", "text"],
                ["Pages", "Number of pages", "number"],
                ["Price", "Price", "number"],
                ["Discount price", "Optional discounted price", "number"],
                ["Cover image URL", "https://...", "url"],
              ].map(([label, placeholder, type]) => (
                <label
                  key={label}
                  className="m-1 block text-sm font-medium text-white"
                >
                  <span className="mb-1.5 block">{label}</span>
                  <input
                    type={type}
                    name={
                      label === "Discount price"
                        ? "discountPrice"
                        : label === "Cover image URL"
                          ? "CoverImageUrl"
                          : label.toLowerCase()
                    }
                    placeholder={placeholder}
                    value={
                      label === "Cover image URL"
                        ? coverImageUrl
                        : label === "Title"
                          ? bookTitle
                          : undefined
                    }
                    onChange={(event) => {
                      if (label === "Cover image URL") {
                        setCoverImageUrl(event.target.value);
                      } else if (label === "Title") {
                        setBookTitle(event.target.value);
                      }
                    }}
                    min={type === "number" ? "0" : undefined}
                    required
                    className="w-full rounded-md border border-blue-200 bg-white p-2.5 text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-300"
                  />
                </label>
              ))}
              {hasDuplicateTitle && (
                <p
                  className="text-sm text-amber-200 md:col-span-2"
                  role="status"
                >
                  You have already listed a book with this title.
                </p>
              )}

              <label className="m-1 block text-sm font-medium text-white md:col-span-2">
                <span className="mb-1.5 block">Abstract</span>
                <textarea
                  name="abstract"
                  placeholder={
                    isGeneratingAbstract
                      ? "Generating abstract..."
                      : "What should readers know about this book?"
                  }
                  rows="4"
                  required
                  value={bookAbstract}
                  onChange={(event) => setBookAbstract(event.target.value)}
                  className="w-full resize-y rounded-md border border-blue-200 bg-white p-2.5 text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-300"
                />
              </label>

              <div className="m-1 md:col-span-2">
                <div className="flex flex-wrap items-center gap-3">
                  {uploadedImagePreviews.map((image) => (
                    <div key={image.url} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.url)}
                        aria-label={`Remove ${image.name}`}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-700 shadow hover:bg-red-100"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 3 && (
                    <label
                      htmlFor="book-cover"
                      className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border border-dashed border-blue-200 bg-blue-800/60 text-white transition hover:bg-blue-800"
                      title="Add images"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span className="sr-only">Add images</span>
                    </label>
                  )}
                </div>
                <p className="mt-2 text-xs text-blue-100">
                  {uploadedImages.length} of 3 images selected
                </p>
                <input
                  type="file"
                  id="book-cover"
                  ref={uploadInputRef}
                  multiple
                  max="3"
                  onChange={handleImageSelection}
                  accept="image/*"
                  className="sr-only"
                />
              </div>

              {coverImageUrl && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm">Cover URL preview</p>
                  <img
                    src={coverImageUrl}
                    alt="Book cover from URL"
                    className="h-36 w-28 rounded object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={(event) => clearBookForm(event.currentTarget.form)}
                className="rounded-md border border-white/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Clear form
              </button>
              <button
                type="submit"
                disabled={isAddingBook}
                className="rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-blue-900 shadow transition hover:bg-blue-50"
              >
                {isAddingBook ? "Adding..." : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      )}
      {bookStatus && (
        <section className="mx-auto mb-12 mt-8 w-full max-w-5xl px-4 sm:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your listed books
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review the books you have put up for sale and their approval
                status.
              </p>
            </div>
            {!isLoadingUploadedBooks && uploadedBooks.length > 0 && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {uploadedBooks.length}{" "}
                {uploadedBooks.length === 1 ? "book" : "books"}
              </span>
            )}
          </div>

          {isLoadingUploadedBooks ? (
            <div
              className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500"
              role="status"
            >
              Loading your books...
            </div>
          ) : uploadedBooksLoadFailed ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <h3 className="font-semibold text-red-800">
                Your books couldn&apos;t be loaded
              </h3>
              <p className="mt-2 text-sm text-red-700">
                Please check your connection and refresh the page to try again.
              </p>
            </div>
          ) : uploadedBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FontAwesomeIcon icon={faBookOpen} className="text-xl" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                You haven&apos;t listed any books yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                Books you add for sale will appear here, along with their review
                status.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookStatus(false);
                  setSellBookStatus(true);
                  setPurchaseStatus(false);
                }}
                className="mt-6 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                List your first book
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedBooks.map((book) => {
                const status = (book.status || "pending").toLowerCase();
                const statusStyle =
                  status === "approved"
                    ? "bg-green-50 text-green-700 ring-green-200"
                    : status === "sold"
                      ? "bg-slate-100 text-slate-700 ring-slate-200"
                      : status === "rejected"
                        ? "bg-red-50 text-red-700 ring-red-200"
                        : "bg-amber-50 text-amber-700 ring-amber-200";
                const imageUrl =
                  book.CoverImageUrl ||
                  (book.uploadImages?.[0]
                    ? `${axiosInstance.defaults.baseURL}/uploads/${book.uploadImages[0]}`
                    : "");
                const price = Number(book.price).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                });

                return (
                  <article
                    key={book._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
                      <div className="flex min-h-52 items-center justify-center bg-gray-100 p-4 sm:min-h-full">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`${book.title} cover`}
                            className="h-48 w-32 rounded-md object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-48 w-32 flex-col items-center justify-center gap-2 rounded-md bg-blue-100 text-blue-700">
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              className="text-3xl"
                            />
                            <span className="px-2 text-center text-xs">
                              No cover image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {book.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              by {book.author}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyle}`}
                            >
                              {status}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeBook(book._id, book.title)}
                              disabled={deletingBookId !== null}
                              aria-label={`Delete ${book.title}`}
                              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                              {deletingBookId === book._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                          <span className="font-semibold text-blue-700">
                            {price}
                          </span>
                          {book.discountPrice != null && (
                            <span className="text-gray-500">
                              Discount price:{" "}
                              {Number(book.discountPrice).toLocaleString(
                                "en-IN",
                                {
                                  style: "currency",
                                  currency: "INR",
                                },
                              )}
                            </span>
                          )}
                          {book.category && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                              {book.category}
                            </span>
                          )}
                        </div>

                        {book.abstract && (
                          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                            {book.abstract}
                          </p>
                        )}

                        {(book.publisher || book.pages || book.language) && (
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
                            {book.publisher && (
                              <span>Publisher: {book.publisher}</span>
                            )}
                            {book.pages && <span>{book.pages} pages</span>}
                            {book.language && <span>{book.language}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
      {purchaseStatus && (
        <section className="mx-auto mb-12 mt-8 w-full max-w-5xl px-4 sm:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your purchased books
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Books you have purchased from other sellers.
              </p>
            </div>
            {!isLoadingBoughtBooks &&
              !boughtBooksLoadFailed &&
              boughtBooks.length > 0 && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {boughtBooks.length}{" "}
                  {boughtBooks.length === 1 ? "book" : "books"}
                </span>
              )}
          </div>

          {isLoadingBoughtBooks ? (
            <div
              className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500"
              role="status"
            >
              Loading your purchases...
            </div>
          ) : boughtBooksLoadFailed ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <h3 className="font-semibold text-red-800">
                Your purchases couldn&apos;t be loaded
              </h3>
              <p className="mt-2 text-sm text-red-700">
                Please check your connection and refresh the page to try again.
              </p>
            </div>
          ) : boughtBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FontAwesomeIcon icon={faBookOpen} className="text-xl" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No purchases yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                Books you purchase will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {boughtBooks.map((book) => {
                const imageUrl = book.CoverImageUrl
                  ? book.CoverImageUrl
                  : book.uploadImages?.[0]
                    ? `${axiosInstance.defaults.baseURL}/uploads/${book.uploadImages[0]}`
                    : "";
                const price = Number(book.price).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                });

                return (
                  <article
                    key={book._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
                      <div className="flex min-h-52 items-center justify-center bg-gray-100 p-4 sm:min-h-full">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`${book.title} cover`}
                            className="h-48 w-32 rounded-md object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-48 w-32 flex-col items-center justify-center gap-2 rounded-md bg-blue-100 text-blue-700">
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              className="text-3xl"
                            />
                            <span className="px-2 text-center text-xs">
                              No cover image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {book.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              by {book.author}
                            </p>
                          </div>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                            Purchased
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                          <span className="font-semibold text-blue-700">
                            {price}
                          </span>
                          {book.category && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                              {book.category}
                            </span>
                          )}
                        </div>

                        {book.abstract && (
                          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                            {book.abstract}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Profile;
