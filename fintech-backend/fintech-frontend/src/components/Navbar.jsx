import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth <= 768
    );

  const location =
    useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= 768
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const navItems = [
    {
      name: "Home",
      path: "/home",
    },
    {
      name: "Wallet",
      path: "/wallet",
    },
    {
      name: "Transfer",
      path:
        "/transaction",
    },
    {
      name: "History",
      path: "/history",
    },
    {
      name: "Account",
      path: "/account-link",
    },
  ];

  const activeLink = (
    path
  ) =>
    location.pathname ===
    path;

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo}>
        FinTech
      </div>

      {/* Desktop Menu */}
      {!isMobile && (
        <div
          style={
            styles.desktopMenu
          }
        >
          {navItems.map(
            (item) => (
              <Link
                key={
                  item.path
                }
                to={
                  item.path
                }
                style={{
                  ...styles.link,
                  color:
                    activeLink(
                      item.path
                    )
                      ? "#4F46E5"
                      : "#111827",
                }}
              >
                {
                  item.name
                }
              </Link>
            )
          )}
        </div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          style={
            styles.menuBtn
          }
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >
          {menuOpen
            ? "✕"
            : "☰"}
        </button>
      )}

      {/* Mobile Dropdown */}
      {isMobile &&
        menuOpen && (
          <div
            style={
              styles.mobileMenu
            }
          >
            {navItems.map(
              (
                item
              ) => (
                <Link
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  onClick={() =>
                    setMenuOpen(
                      false
                    )
                  }
                  style={{
                    ...styles.mobileLink,
                    color:
                      activeLink(
                        item.path
                      )
                        ? "#4F46E5"
                        : "#111827",
                  }}
                >
                  {
                    item.name
                  }
                </Link>
              )
            )}
          </div>
        )}
    </nav>
  );
}

const styles = {
  nav: {
    position:
      "sticky",
    top: 0,
    zIndex: 999,
    background:
      "white",
    padding:
      "16px 22px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    flexWrap:
      "wrap",
    boxShadow:
      "0 6px 18px rgba(0,0,0,0.06)",
    fontFamily:
      "Arial",
  },

  logo: {
    fontSize: "30px",
    fontWeight:
      "800",
    color:
      "#4F46E5",
  },

  desktopMenu: {
    display: "flex",
    gap: "22px",
    alignItems:
      "center",
  },

  link: {
    textDecoration:
      "none",
    fontWeight:
      "600",
    fontSize:
      "15px",
    transition:
      "0.3s",
  },

  menuBtn: {
    border: "none",
    background:
      "transparent",
    fontSize:
      "30px",
    cursor: "pointer",
    color:
      "#111827",
  },

  mobileMenu: {
    width: "100%",
    display: "flex",
    flexDirection:
      "column",
    gap: "14px",
    marginTop: "16px",
    paddingTop:
      "16px",
    borderTop:
      "1px solid #E5E7EB",
  },

  mobileLink: {
    textDecoration:
      "none",
    fontWeight:
      "600",
    fontSize:
      "16px",
    padding:
      "6px 0",
  },
};

export default Navbar;