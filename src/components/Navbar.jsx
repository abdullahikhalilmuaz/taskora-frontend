import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fas fa-tasks"></i> Taskora
        </Link>

        {user ? (
          <>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="fas fa-home"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/tasks" className="nav-link">
                  <i className="fas fa-list"></i> Tasks
                </Link>
              </li>
              {user.userType === "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      <i className="fas fa-user-plus"></i> Add Employee
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/reports" className="nav-link">
                      <i className="fas fa-chart-bar"></i> Reports
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="nav-user">
              <span className="user-name">
                <i className="fas fa-user-circle"></i> {user.name}
                <span className="user-badge">{user.userType}</span>
              </span>
              <button onClick={handleLogout} className="btn-logout">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </>
        ) : (
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
