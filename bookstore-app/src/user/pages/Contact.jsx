import React, { useRef } from "react";
import UserHeader from "../components/UserHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

function Contact() {
  const form = useRef();

  const sendEmail = async (e) => {
    e.preventDefault();
    const formElement = form.current;

    const name = formElement.elements.namedItem("name");
    const email = formElement.elements.namedItem("email");
    const title = formElement.elements.namedItem("title");

    if (!name.value.trim() || !email.value.trim() || !title.value.trim()) {
      toast.warning("Please fill the form completely.");
      return;
    }

    try {
      const response = await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formElement,
        {
          publicKey: import.meta.env.VITE_PUBLIC_KEY,
        },
      );

      console.log("SUCCESS!", response.status, response.text);

      toast.success(
        "Thank you for contacting us! Our team will get back to you.",
      );

      formElement.reset();
    } catch (error) {
      console.error("EMAILJS ERROR:", error);

      toast.error("Failed to send your message. Please try again.");
    }
  };

  return (
    <>
      <UserHeader />
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8 lg:px-10">
        <h1 className="text-center text-2xl font-bold sm:text-3xl">Contacts</h1>
        <div className="p-4 sm:p-6 lg:p-8">
          <p className="text-justify sm:text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
            sed natus ut iure unde! Cum in rerum labore aperiam quibusdam hic,
            quas corporis culpa iste? Doloribus, eveniet porro. Exercitationem,
            vero. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Facere itaque reiciendis tempore molestiae similique natus quisquam
            fuga. Culpa fugit cum illum explicabo odit eius itaque harum, quod
            placeat veritatis?
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-3 sm:grid-cols-2 sm:gap-5 sm:p-5 lg:grid-cols-3">
          <div className="mt-2 flex min-w-0 items-center gap-2 sm:mt-3">
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ color: "rgb(0, 0, 0)", borderRadius: "50%" }}
              className="text-2xl bg-gray-100 p-3"
            />
            <div className="text-justify ms-2">
              <p>BookStore-123</p>
              <p>Calicut, Near Ksrtc Stand</p>
            </div>
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-2 sm:mt-3">
            <FontAwesomeIcon
              icon={faPhone}
              style={{ color: "rgb(0, 0, 0)", borderRadius: "50%" }}
              className="text-2xl bg-gray-100 p-3"
            />
            <h3 className="ms-2">+91 7994699455 </h3>
          </div>

          <div className="mt-2 flex min-w-0 items-center gap-2 sm:mt-3">
            <FontAwesomeIcon
              icon={faEnvelope}
              style={{ color: "rgb(0, 0, 0)", borderRadius: "50%" }}
              className="text-2xl bg-gray-100 p-3"
            />
            <p className="ms-2">bookstore@gmail.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-2 sm:p-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <form
              ref={form}
              onSubmit={sendEmail}
              className="flex flex-col gap-2"
            >
              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                Send us a message
              </h2>
              <label
                htmlFor="contact-name"
                className="mt-2 text-sm font-semibold text-slate-700"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <label
                htmlFor="contact-email"
                className="mt-2 text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <label
                htmlFor="contact-message"
                className="mt-2 text-sm font-semibold text-slate-700"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="title"
                rows={6}
                required
                className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="submit"
                value="Send message"
                className="mt-4 w-full cursor-pointer rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:self-start"
              />
            </form>
          </div>
          <div className="p-2 sm:p-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.54684727985!2d75.72841394018309!3d11.255555506919812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65938563d4747%3A0x32150641ca32ecab!2sKozhikode%2C%20Keralam!5e0!3m2!1sen!2sin!4v1790765730071!5m2!1sen!2sin"
              width="600"
              height="450"
              allowfllscreen=""
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              className="aspect-video w-full rounded"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
