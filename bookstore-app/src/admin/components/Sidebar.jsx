import {
  faBook,
  faGear,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance";

function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(sessionStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener("auth-change", syncUser);
    return () => window.removeEventListener("auth-change", syncUser);
  }, []);

  const profileImage = user?.picture
    ? user.picture.startsWith("http")
      ? user.picture
      : `${axiosInstance.defaults.baseURL}/uploads/${user.picture.replace(/^\/+/, "").replace(/^uploads\//, "")}`
    : "";

  return (
    <div className="flex h-full min-h-full flex-col items-center justify-start bg-blue-300 px-3 py-20">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex size-35 items-center justify-center rounded-full border-4 border-white bg-black shadow-md">
          {profileImage ? (
            <img src={profileImage} alt={user.username} className="size-full rounded-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={faUser} className="text-7xl text-white" />
          )}
        </div>

        <h3 className="font-black">{user?.username || "Bookstore Admin"}</h3>
      </div>

      <nav className="mt-9 flex flex-col items-center justify-center gap-4 font-bold">
        <Link to="/admin-dashboard">
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>

        <Link to="/admin-resource">
          <FontAwesomeIcon icon={faBook} /> All Books
        </Link>

        <Link to="/admin-settings">
          <FontAwesomeIcon icon={faGear} /> Settings
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
