import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faChevronDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function UserHeader() {
  const navigate = useNavigate();
  const [listStatus, setListStatus] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [token, setToken] = useState("");
  const [userDp, setUserDp] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const syncAuthState = () => {
      const userToken = sessionStorage.getItem("token") || "";
      const storedUser = sessionStorage.getItem("user");
      let user = null;

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch {
          sessionStorage.removeItem("user");
        }
      }

      setToken(userToken);
      setUserDp(user?.picture || "");
      setUserId(user?._id);
    };

    syncAuthState();
    window.addEventListener("auth-change", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("auth-change", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const URL = axiosInstance.defaults.baseURL;
  const profileImage = userDp
    ? userDp.startsWith("http")
      ? userDp
      : `${URL}/uploads/${userDp.replace(/^\/+/, "").replace(/^uploads\//, "")}`
    : "";

  const loginLink = (
    <Link
      to="/login"
      className="inline-flex items-center gap-2 rounded-lg border border-current px-4 py-2 transition hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <FontAwesomeIcon icon={faUser} /> Login
    </Link>
  );

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setProfileMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const accountControl = token ? (
    <div className="relative">
      <button
        type="button"
        onClick={() => setProfileMenuOpen((open) => !open)}
        aria-expanded={profileMenuOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full p-1 hover:bg-black/10 "
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Your profile"
            className="h-10 w-10 rounded-full border border-current object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current bg-gray-200 text-gray-700">
            <FontAwesomeIcon icon={faUser} />
          </span>
        )}
        <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
      </button>

      {profileMenuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 text-gray-800 shadow-xl"
        >
          <Link
            to={`/profile/${userId}`}
            role="menuitem"
            onClick={() => setProfileMenuOpen(false)}
            className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          >
            <FontAwesomeIcon icon={faUser} className="mr-3 w-4 text-gray-500" />
            Profile
          </Link>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 focus:bg-red-50 focus:outline-none"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="mr-3 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    loginLink
  );

  return (
    <>
      <div className="grid grid-cols-3 p-3">
        <div className="flex items-center">
          <img src="https://bookstore-wine-nu.vercel.app/logo.png" alt="" />
          <h1 className="text-3xl font-bold ms-3 md:hidden">BOOKSTORE</h1>
        </div>
        <div className="md:flex items-center justify-center hidden">
          <h1 className="text-3xl font-bold">BOOKSTORE</h1>
        </div>
        <div className="md:flex justify-end gap-5 items-center hidden">
          <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
          <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
          <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
          {accountControl}
        </div>
      </div>
      <nav className="bg-black text-white font-bold p-3 md:flex item-center justify-center ">
        <div className="flex justify-between items-center w-full md:hidden">
          <button onClick={() => setListStatus(!listStatus)}>
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
          {accountControl}
        </div>

        <div
          className={
            listStatus ? "flex flex-col gap-5 mt-2 my-2" : "md:flex hidden"
          }
        >
          <Link to={"/"} className="mx-4">
            Home
          </Link>
          <Link to={"/all-books"} className="mx-4">
            Books
          </Link>
          <Link to={"/contact"} className="mx-4">
            Contact
          </Link>
        </div>
      </nav>
    </>
  );
}

export default UserHeader;
