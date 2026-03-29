import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup Successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex">
      <div className="row w-100">
        {/* Left Image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/bg.jpg"
            alt="bg"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h2 className="mb-3">Fluid Workspace</h2>
            <h3 className="mb-4">Create Account</h3>

            <form onSubmit={handleSignup}>
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-3"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="form-control mb-3"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="btn btn-success w-100 mb-3">
                Signup
              </button>

              <p>
                Already have account? <Link to="/">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}