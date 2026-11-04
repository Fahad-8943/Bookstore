import React, { useContext, useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bookImage from "../../assets/books.jpg";
import { Link, useNavigate } from "react-router";
import about from "../../assets/about.jpg";
import { getHomePageBooksAPI } from "../../services/allApi";
import { searchContext } from "../../context/SearchContext";
import { ToastContainer, toast } from "react-toastify";

function Home() {
  const [homeBooks, setHomeBooks] = useState([]);
  console.log(homeBooks);
  const { searchKey, setSearchKey } = useContext(searchContext);
  const navigate = useNavigate()

  useEffect(() => {
    getbooks();
  }, []);
  const getbooks = async () => {
    const res = await getHomePageBooksAPI();
    if (res.status == 200) {
      setHomeBooks(res.data);
    }
  };

  const handleSearch=()=>{
    if(!searchKey){
      toast.warning("Please enter a search term");
    }
    else if(!sessionStorage.getItem('token')){
      toast.warning("please Login!!")
      setTimeout(()=>{
        navigate('/login')
      },2000)
    }
    else if( searchKey && sessionStorage.getItem("token")){
      navigate("/all-books")
    }
    else {
      toast.error("Something went wrong")
    }
  }
  return (
    <>
      <ToastContainer position="top-center" />
      <UserHeader />
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bookImage})` }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center text-white">
          <h1 className="text-center text-4xl font-bold sm:text-5xl md:text-6xl">
            Wonderfull Gifts
          </h1>
          <p className="mt-2 px-4 text-center sm:px-0">
            Give your family and friends a book
          </p>

          <div className="mt-9 w-full max-w-xl px-4 sm:px-0">
            <label htmlFor="home-book-search" className="sr-only">
              Search books
            </label>
            <div className="relative">
              <input
                id="home-book-search"
                type="text"
                onChange={(e) => {
                  setSearchKey(e.target.value);
                }}
                className="w-full rounded-full border border-white/70 bg-white/95 py-4 pl-5 pr-12 text-base text-slate-900 shadow-xl outline-none backdrop-blur transition placeholder:text-slate-500 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-300/40"
                placeholder="Search Books"
              />
              <button
                type="button"
                onClick={handleSearch}
                aria-label="Search books"
                className="absolute right-5 top-1/2 z-10 -translate-y-1/2 text-slate-700 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  aria-hidden="true"
                  className="text-lg"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="flex items-center justify-center flex-col my-10">
        <h1 className="text-3xl font-bold">New Arrivals</h1>
        <h1 className="text-xl mt-4">Explore our latest collections</h1>
        <div className="md:grid grid-cols-4 ">
          {homeBooks?.map((book) => (
            <div className="p-3">
              <div className="shadow p-3 rounded text-center">
                <img
                  style={{ height: "300px" }}
                  src={book?.CoverImageUrl}
                  alt={book?.title}
                />
                <h4 className="text-blue-800">Author</h4>
                <h3>{book?.title}</h3>
                <h4>{book?.price}</h4>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Link className="bg-blue-900 p-3 text-white" to={"/all-books"}>
            Explore More
          </Link>
        </div>
      </section>
      {/* FEATURED AUTHORS */}
      <section className="bg-white py-16 px-6 md:px-10 lg:px-14">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Author Content */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              FEATURED AUTHORS
            </h2>

            <h3 className="text-base md:text-lg font-semibold text-black mb-8">
              Captivates with every word
            </h3>

            <p className="text-base md:text-lg font-medium text-black leading-relaxed mb-8">
              Authors in a bookstore application are the visionaries behind the
              books that fill the shelves, each contributing their own unique
              voice, creativity, and perspective to the world of literature.
              Whether writing fiction, non-fiction, poetry, or educational
              works, authors bring stories, ideas, and knowledge to life in ways
              that resonate with readers of all backgrounds.
            </p>

            <p className="text-base md:text-lg font-medium text-black leading-relaxed">
              Their work spans a wide array of genres, from thrilling mysteries
              and heartwarming romances to thought-provoking memoirs and
              insightful self-help books. Through their words, authors not only
              entertain and inform but also inspire and challenge readers to
              think deeply, reflect, and grow. In a bookstore application,
              authors' works become accessible to readers everywhere, offering a
              diverse and rich tapestry of voices and experiences, all of which
              contribute to the evolving landscape of modern literature.
            </p>
          </div>

          {/* Author Image */}
          <div className="flex justify-center md:justify-center">
            <img
              src={about}
              alt="Featured Author"
              className="w-150 h-87.5 md:h-100 object-cover "
            />
          </div>
        </div>
      </section>
      {/* testimonials */}
      <section className="flex items-center justify-center flex-col md:px-30">
        <h1 className="text-3xl font-bold"> Testimonials</h1>
        <h1 className="text-xl">See what others are saying</h1>
        <div className="flex items-center justify-center flex-col mt-5">
          <img
            src="https://media.licdn.com/dms/image/v2/D5603AQErIMAJ8Ylr8Q/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1675583214231?e=2147483647&v=beta&t=6LJDzzdTaXvPLZiVXytfTM0rxAZJ16wM0BZ4m4sb34k"
            alt=""
            style={{ height: "100px", width: "100px", borderRadius: "50%" }}
          />
          <h6 className="font-bold text-xl">Farheena</h6>
          <p className="text-justify mt-5 text-lg font-bold">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam,
            veritatis illo molestias neque, reprehenderit dolorem, quis nisi
            ratione cum doloremque ea numquam culpa ex nostrum ab similique
            cupiditate quisquam deleniti. Numquam cum repudiandae laboriosam,
            expedita officia doloribus ex dignissimos odio deserunt nobis illum
            est in ad perferendis ipsam earum pariatur.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
