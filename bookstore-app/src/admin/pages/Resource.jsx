import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import axiosInstance from "../../api/axiosInstance";
import {
  adminBooksAPI,
  editBookStatusAPI,
  getAllUserAPI,
} from "../../services/allApi";

function Resource() {
  const [bookList, setBookList] = useState(true);
  const [userList, setUserList] = useState(false);

  const [allBooks, setAllBooks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [booksError, setBooksError] = useState("");

  useEffect(() => {
    if (bookList) {
      getBooks();
    }
    if (userList) {
      getUsers();
    }
  }, [bookList, userList]);

  const getBooks = async () => {
    const result = await adminBooksAPI();
    if (result.status === 200) {
      setAllBooks(result.data);
      setBooksError("");
      return;
    }

    const errorMessage =
      result.response?.data?.message ?? result.response?.data;
    setBooksError(
      typeof errorMessage === "string"
        ? errorMessage
        : result.message || "Unable to load books.",
    );
  };

  const getUsers = async () => {
    const res = await getAllUserAPI();
    console.log(res);

    if (res.status === 200) {
      setAllUsers(res.data);
    }
  };

  const updateBookStatus = async (id) => {
    const res = await editBookStatusAPI(id);
    if (res.status == 200) {
      getBooks();
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0">
        <AdminHeader />
      </div>

      {/* DASHBOARD BODY */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="shrink-0 md:h-full md:w-1/6">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          {/* TABS */}
          <div className="mt-5 flex items-center justify-center">
            <p
              onClick={() => {
                setUserList(false);
                setBookList(true);
              }}
              className={
                bookList
                  ? "cursor-pointer rounded-t border-l border-r border-t border-gray-400 px-3 text-blue-700"
                  : "cursor-pointer border-b border-gray-400 px-3 text-black"
              }
            >
              Book List
            </p>

            <p
              onClick={() => {
                setUserList(true);
                setBookList(false);
              }}
              className={
                userList
                  ? "cursor-pointer rounded-t border-l border-r border-t border-gray-400 px-3 text-blue-700"
                  : "cursor-pointer border-b border-gray-400 px-3 text-black"
              }
            >
              User List
            </p>
          </div>

          {/* BOOK LIST */}
          {bookList && (
            <section className="mx-auto my-6 w-full max-w-6xl px-4 sm:px-6">
              <h1 className="text-center text-2xl font-bold">Book List</h1>

              {/* BOOK GRID */}
              {booksError && (
                <p className="col-span-full text-center text-red-600">
                  {booksError}
                </p>
              )}
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {allBooks.map((book) => (
                  <div
                    key={book._id}
                    className="rounded-sm border border-gray-200 bg-white p-3 text-center shadow-md"
                  >
                    {/* BOOK DETAILS */}

                    <img
                      src={book.CoverImageUrl}
                      alt={book.title}
                      className="mx-auto h-52 w-full object-cover"
                    />

                    <p className="mt-2 text-xs text-blue-600">{book.author}</p>

                    <h3 className="text-sm font-medium">{book.title}</h3>

                    <p className="text-blue-500">₹ {book.price}</p>

                    {/* APPROVE BUTTON */}
                    {book.status === "approved" ? (
                      <p className="mt-3 w-full rounded bg-green-100 py-2 text-xs font-semibold text-green-700">
                        Approved
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="mt-3 w-full bg-blue-600 py-2 text-xs text-white hover:bg-blue-700"
                        onClick={() => updateBookStatus(book._id)}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* USER LIST */}
          {userList && (
            <section className="mx-auto my-6 w-full max-w-6xl px-4 sm:px-6">
              <h1 className="text-center text-2xl font-bold">All Users</h1>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allUsers.map((user) => (
                  <div
                    key={user._id}
                    className="rounded border border-gray-200 bg-white p-4 shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      {user.picture ? (
                        <img
                          src={
                            user.picture.startsWith("http")
                              ? user.picture
                              : `${axiosInstance.defaults.baseURL}/uploads/${user.picture}`
                          }
                          alt={user.username}
                          className="size-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-gray-300">
                          <FontAwesomeIcon
                            icon={faUser}
                            className="text-3xl text-gray-500"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate font-bold">{user.username}</h3>
                        <p className="truncate text-sm text-gray-500">
                          {user.email}
                        </p>
                        {user.bio && (
                          <p className="mt-1 text-sm text-gray-600">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {allUsers.length === 0 && (
                  <p className="col-span-full text-center text-gray-500">
                    No users found.
                  </p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Resource;
