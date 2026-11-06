import { useContext } from "react";
import { Link } from "react-router-dom";
import { routerContext } from "../context/RouterGuardContext";
import "./Pnf.css";

function Pnf() {
  const { role, authorizedUser } = useContext(routerContext);
  const returnPath = !authorizedUser
    ? "/login"
    : role === "admin"
      ? "/admin-dashboard"
      : "/";
  const returnLabel = !authorizedUser
    ? "Sign in"
    : role === "admin"
      ? "Back to dashboard"
      : "Back to home";

  return (
    <main className="pnf-page">
      <div className="pnf-content">
        <div className="pnf-copy">
          <p className="pnf-eyebrow">Looks like this page got lost</p>
          <h1 className="pnf-code" aria-label="Error 404">
            4<span>0</span>4
          </h1>
          <h2>We can&apos;t find that page.</h2>
          <p className="pnf-description">
            The page may have moved, or the link might be out of date. Let&apos;s
            get you back to a good book.
          </p>
          <div className="pnf-actions">
            <Link className="pnf-home-link" to={returnPath}>
              {returnLabel}
            </Link>
            <Link className="pnf-books-link" to="/all-books">
              Browse books
            </Link>
          </div>
        </div>

        <div className="pnf-illustration" aria-hidden="true">
          <span className="pnf-orbit pnf-orbit-one" />
          <span className="pnf-orbit pnf-orbit-two" />
          <span className="pnf-star pnf-star-one">✦</span>
          <span className="pnf-star pnf-star-two">✦</span>
          <div className="pnf-book pnf-book-back">
            <span />
          </div>
          <div className="pnf-book pnf-book-front">
            <span />
          </div>
          <div className="pnf-page-shape" />
        </div>
      </div>
    </main>
  );
}

export default Pnf;
