import { Link } from "react-router-dom";
import UserHeader from "../components/UserHeader";

function PaymentFail() {
  return (
    <>
      <UserHeader />
      <main className="flex min-h-[70vh] items-center justify-center bg-rose-50/60 px-4 py-12">
        <section className="payment-result-card w-full max-w-xl rounded-2xl border border-rose-100 bg-white px-6 py-10 text-center shadow-lg shadow-rose-900/5 sm:px-12 sm:py-12">
          <div
            className="payment-result-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700"
            aria-hidden="true"
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="payment-result-mark"
                d="M7 7 17 17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                className="payment-result-mark payment-result-mark-second"
                d="M17 7 7 17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-6 text-sm font-semibold text-rose-700">
            Payment unsuccessful
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your payment didn’t go through
          </h1>
          <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">
            Please try again or contact us if you need help.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/all-books"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-rose-700 px-6 py-3 font-semibold text-white transition hover:bg-rose-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
            >
              Back to books
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            >
              Contact support
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default PaymentFail;
