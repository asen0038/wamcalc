import "./App.css";

import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "./services/auth.service";
import Home from "./components/Home/home.component";
import Login from "./components/Authentication/login.component";
import Register from "./components/Authentication/register.component";
import Profile from "./components/Profile/profile.component";
import About from "./components/About/about.component";
import Upload from "./components/Calculator/upload.component";
import AuthVerify from "./auth-verify";
import { Grid } from "@mui/material";
import EnhancedTable from "./components/History/history.component";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      currentUser: AuthService.getCurrentUser(),
    };
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <nav
            style={{ padding: "10px" }}
            className="navbar navbar-expand navbar-dark bg-dark"
          >
            <Link to={"/"} className="navbar-brand">
              WAM-Calc
            </Link>
            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/upload"} className="nav-link">
                    WAM Calculator
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/history"} className="nav-link">
                    History
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/about" className="nav-link">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a href="/about" className="nav-link">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </nav>
        </Grid>
        <Grid item xs={12}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route
              exact
              path="/history"
              element={<EnhancedTable currentUser={this.state.currentUser} />}
            />
            <Route exact path="/upload" element={<Upload />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </Grid>
        <AuthVerify logOut={this.logOut} />
      </Grid>
    );
  }
}

export default App;
