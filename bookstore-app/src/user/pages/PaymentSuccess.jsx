import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { verifyPaymentAPI } from "../../services/allApi";

function PaymentSuccess() {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [userId] = useState(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "null");
      return user?._id || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id",
      );
      if (!sessionId) {
        setVerificationStatus("failed");
        return;
      }

      try {
        const res = await verifyPaymentAPI({ sessionId });
        setVerificationStatus(res?.status === 200 ? "verified" : "failed");
      } catch (error) {
        console.error("Unable to verify payment", error);
        setVerificationStatus("failed");
      }
    };

    verifyPayment();
  }, []);

  return (
    <>
      <UserHeader />
      <main className="flex min-h-[70vh] items-center justify-center bg-emerald-50/60 px-4 py-12">
        <section className="payment-result-card w-full max-w-xl rounded-2xl border border-emerald-100 bg-white px-6 py-10 text-center shadow-lg shadow-emerald-900/5 sm:px-12 sm:py-12">
          <div
            className={`payment-result-icon mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              verificationStatus === "failed"
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
            aria-hidden="true"
          >
            {verificationStatus === "verified" ? (
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="payment-result-mark"
                  d="M5 12.5 9.5 17"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className="payment-result-mark payment-result-mark-second"
                  d="M9.5 17 19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span className="text-2xl font-bold">
                {verificationStatus === "failed" ? "!" : "..."}
              </span>
            )}
          </div>
          <p
            className={`mt-6 text-sm font-semibold ${
              verificationStatus === "failed"
                ? "text-rose-700"
                : "text-emerald-700"
            }`}
          >
            {verificationStatus === "verified"
              ? "Payment successful"
              : verificationStatus === "verifying"
                ? "Verifying payment"
                : "Payment verification failed"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {verificationStatus === "verified"
              ? "Thank you for your purchase"
              : verificationStatus === "verifying"
                ? "Please wait a moment"
                : "We couldn't confirm your payment"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-600">
            {verificationStatus === "verified"
              ? "Your payment was successful. Thanks for shopping with us."
              : verificationStatus === "verifying"
                ? "We're confirming your payment with the payment provider."
                : "Your payment may have gone through, but we couldn't verify it. Please contact support before trying again."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={userId ? `/profile/${userId}` : "/all-books"}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            >
              {userId ? "View my library" : "Browse books"}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default PaymentSuccess;
