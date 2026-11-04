import React, { useContext, useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { Link } from "react-router";
import { getAllBooksAPI } from "../../services/allApi";
import { searchContext } from "../../context/SearchContext";

function AllBooks() {
  const [token, setToken] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [dummyBooks, setDummyBooks] = useState([]);
  // console.log(categoryList);
  const { searchKey, setSearchKey } = useContext(searchContext);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setToken(sessionStorage.getItem("token"));
    }
    getbooks();
  }, [searchKey]);

  const getbooks = async () => {
    const res = await getAllBooksAPI(searchKey);
    if (res.status == 200) {
      setAllBooks(res.data);
      setDummyBooks(res.data);
      const tempCategoryList = res.data.map((book) => book.category);
      setCategoryList([...new Set(tempCategoryList)]);
    }
  };

  const filterBooks = (category) => {
    console.log(category);
    if (category != "all") {
      setAllBooks(dummyBooks.filter((book) => book.category == category));
    } else {
      getbooks();
    }
  };

  return (
    <div>
      <UserHeader />
      {token ? (
        <section className="mx-auto mt-6 max-w-6xl px-6">
          {/* Heading */}
          <h1 className="text-center text-2xl font-bold">Collections</h1>

          {/* Search */}
          <div className="mx-auto mt-4 flex w-full max-w-md">
            <input
              type="search"
              placeholder="Search by Title"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
            />

            <button className="w-24 bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800">
              Search
            </button>
          </div>

          {/* Content */}
          <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-[150px_1fr]">
            {/* Filters */}
            <div>
              <h2 className="mb-4 text-lg font-medium">Filters</h2>

              <div className="space-y-3 text-sm text-gray-700">
                {categoryList.map((category) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      onClick={() => filterBooks(category)}
                    />
                    {category}
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    onClick={() => filterBooks("all")}
                  />
                  No Filter
                </label>
              </div>
            </div>

            {/* Books */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Book 1 */}
              {allBooks
                ?.filter(
                  (book) => book.status !== "sold" && book.status !== "pending",
                )
                .map((book) => (
                  <div key={book._id}>
                    <Link to={`/view/${book._id}/book`}>
                      <div className="rounded-sm border border-gray-200 bg-white p-3 text-center shadow-md">
                        <img
                          src={book.CoverImageUrl}
                          alt="The Da Vinci Code"
                          className="mx-auto h-52.2 w-full object-cover"
                        />

                        <p className="mt-2 text-xs text-blue-600">
                          {book.author}
                        </p>

                        <h3 className="text-sm font-medium">{book.title}</h3>
                        <p className="mt-2 text-xs text-gray-600">
                          Price:{book.price}
                        </p>

                        <button className="mt-3 w-full bg-blue-600 py-2 text-xs text-white hover:bg-blue-700">
                          Discount Price {book.discountPrice}
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-auto max-w-md rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
            🔒
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            More details await
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Log in to view complete book details, connect with the seller, and
            learn more about this book.
          </p>

          <a
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Log in to continue
          </a>

          <p className="mt-4 text-xs text-gray-500">
            New here?{" "}
            <a
              href="/signup"
              className="font-medium text-indigo-600 hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default AllBooks;
