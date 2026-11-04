import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Footer() {
  return (
    <>
      <div className=" md:grid grid-cols-3 bg-gray-900 text-white gap-20 p-10">
        <div className="p-5">
          <h4 className="font-bold">ABOUT US</h4>
          <p className="mt-4 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod sint
            possimus iure vero recusandae autem amet eum quos, dolores
            aspernatur animi quis ipsam labore tempore praesentium deleniti.
            Natus, non architecto?
          </p>
        </div>
        <div className="p-5">
          <h4 className="font-bold">NEWSLETTER</h4>
          <p className="mt-4">stay updated with our latest trends</p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="email id"
              className="bg-white placeholder:text-gray-500  p-2"
            />
            <button className="bg-yellow-400 p-2">
              <FontAwesomeIcon
                icon={faArrowRightLong}
                style={{ color: "rgb(0, 0, 0)" }}
              />
            </button>
          </div>
        </div>
        <div className="p-5">
          <h4 className="font-bold">FOLLOW US</h4>
          <p className="mt-4">Let us be social</p>
          <div className="mt-5 flex gap-2">
            <FontAwesomeIcon icon={faInstagram} className="text-3xl" />
            <FontAwesomeIcon icon={faTwitter} className="text-3xl" />
            <FontAwesomeIcon icon={faFacebook} className="text-3xl" />
            <FontAwesomeIcon icon={faLinkedinIn} className="text-3xl" />
          </div>
        </div>
      </div>
      <div className="bg-black text-white text-center p-5">
        <p>
          Copyright &copy;2025 All rights reserved | This website is made with ❤
          by Fahad
        </p>
      </div>
    </>
  );
}

export default Footer;
