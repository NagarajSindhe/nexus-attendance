// import React, { useState } from "react";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (e) {
//       alert(e.message);
//     }
//   };

//   return (
//     <div className="vh-100 d-flex justify-content-center align-items-center">
//       <form onSubmit={login} className="card p-4 shadow">
//         <h3 className="mb-3">Login</h3>
//         <input className="form-control mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
//         <input type="password" className="form-control mb-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
//         <button className="btn btn-primary w-100">Login</button>
//       </form>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { auth } from "../firebase";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile
// } from "firebase/auth";

// export default function Login() {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (isSignUp) {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         await updateProfile(userCredential.user, { displayName: name });
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-bg vh-100 d-flex flex-column justify-content-center align-items-center px-3">

//       {/* 🔹 BRAND LOGO/NAME */}
//       <div className="text-center mb-4 animate-fade-in">
//         <h1 className="display-5 fw-bold text-white mb-0" style={{ letterSpacing: "-1px" }}>
//           Next<span className="text-info">Attend</span>
//         </h1>
//         <p className="text-white-50 small fw-medium">Smart Attendance. Simplified.</p>
//       </div>

//       {/* 🔹 GLOSSY GLASS CARD */}
//       <div className="glass-card p-4 p-md-5 shadow-2xl" style={{ maxWidth: "420px", width: "100%" }}>
//         <div className="text-center mb-4">
//           <h3 className="fw-bold text-white">{isSignUp ? "Join Us" : "Welcome Back"}</h3>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {isSignUp && (
//             <div className="mb-3">
//               <input
//                 required
//                 className="glass-input w-100"
//                 placeholder="Full Name"
//                 onChange={e => setName(e.target.value)}
//               />
//             </div>
//           )}

//           <div className="mb-3">
//             <input
//               required
//               type="email"
//               className="glass-input w-100"
//               placeholder="Email Address"
//               onChange={e => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="mb-4">
//             <input
//               required
//               type="password"
//               className="glass-input w-100"
//               placeholder="Password"
//               onChange={e => setPassword(e.target.value)}
//             />
//           </div>

//           <button className="glass-btn w-100 py-3 fw-bold" disabled={loading}>
//             {loading ? "AUTHENTICATING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <button
//             className="btn btn-link text-white-50 text-decoration-none small hover-white"
//             onClick={() => setIsSignUp(!isSignUp)}
//           >
//             {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
//           </button>
//         </div>
//       </div>

//       {/* 🔹 FOOTER / COPYRIGHT */}
//       <div className="mt-5 text-center text-white-50 small">
//         <p>© {new Date().getFullYear()} NextAttend. All rights reserved.</p>
//       </div>

//       {/* 🔹 GLOSSY CSS STYLES */}
//       <style>{`
//         .login-bg {
//           background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
//           background-attachment: fixed;
//         }

//         .glass-card {
//           background: rgba(255, 255, 255, 0.05);
//           backdrop-filter: blur(15px) saturate(180%);
//           -webkit-backdrop-filter: blur(15px) saturate(180%);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 28px;
//         }

//         .glass-input {
//           background: rgba(255, 255, 255, 0.08);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           padding: 12px 18px;
//           color: white;
//           outline: none;
//           transition: 0.3s;
//         }

//         .glass-input::placeholder { color: rgba(255, 255, 255, 0.4); }
//         .glass-input:focus {
//           background: rgba(255, 255, 255, 0.12);
//           border-color: #0dcaf0;
//           box-shadow: 0 0 15px rgba(13, 202, 240, 0.2);
//         }

//         .glass-btn {
//           background: #0dcaf0;
//           color: #0f172a;
//           border: none;
//           border-radius: 12px;
//           letter-spacing: 1px;
//           transition: 0.3s;
//         }

//         .glass-btn:hover {
//           background: #0dbcdb;
//           transform: translateY(-2px);
//           box-shadow: 0 10px 20px rgba(13, 202, 240, 0.3);
//         }

//         .glass-btn:disabled { opacity: 0.6; transform: none; }

//         .hover-white:hover { color: white !important; }

//         .animate-fade-in {
//           animation: fadeIn 1s ease-in;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { auth } from "../firebase";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile
// } from "firebase/auth";

// export default function Login() {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (isSignUp) {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         await updateProfile(userCredential.user, { displayName: name });
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-viewport vh-100 d-flex flex-column justify-content-center align-items-center px-4">

//       {/* 🔹 BRAND IDENTITY */}
//       <div className="text-center mb-5 brand-container">
//         <h1 className="brand-logo mb-0">
//           Next<span className="brand-accent">Attend</span>
//         </h1>
//         <div className="brand-divider mx-auto my-2"></div>
//         <p className="brand-slogan">Enterprise Attendance Reimagined</p>
//       </div>

//       {/* 🔹 FROSTED OBSIDIAN CARD */}
//       <div className="obsidian-card p-4 p-md-5 shadow-2xl">
//         <div className="mb-4">
//           <h3 className="fw-bold text-white text-center">
//             {isSignUp ? "Create Account" : "Member Login"}
//           </h3>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {isSignUp && (
//             <div className="input-wrapper mb-3">
//               <input
//                 required
//                 className="pro-input w-100"
//                 placeholder="Full Name"
//                 onChange={e => setName(e.target.value)}
//               />
//             </div>
//           )}

//           <div className="input-wrapper mb-3">
//             <input
//               required
//               type="email"
//               className="pro-input w-100"
//               placeholder="Corporate Email"
//               onChange={e => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="input-wrapper mb-4">
//             <input
//               required
//               type="password"
//               className="pro-input w-100"
//               placeholder="Secure Password"
//               onChange={e => setPassword(e.target.value)}
//             />
//           </div>

//           <button className="pro-btn w-100 py-3" disabled={loading}>
//             {loading ? "VERIFYING..." : isSignUp ? "GET STARTED" : "ACCESS DASHBOARD"}
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           <button
//             className="switch-btn small"
//             onClick={() => setIsSignUp(!isSignUp)}
//           >
//             {isSignUp ? "Already a member? Sign In" : "New to NextAttend? Join Now"}
//           </button>
//         </div>
//       </div>

//       {/* 🔹 FOOTER */}
//       <footer className="mt-5 text-center footer-text">
//         <p>© {new Date().getFullYear()} NextAttend. Professional Attendance Systems.</p>
//       </footer>

//       {/* 🔹 PREMIUM STYLES */}
//       <style>{`
//         @import url('https://fonts.googleapis.com');

//         .login-viewport {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           background: radial-gradient(circle at top right, #2d1b4e 0%, #0a0a0c 60%);
//           background-color: #0a0a0c;
//         }

//         .brand-logo {
//           font-weight: 800;
//           color: #ffffff;
//           letter-spacing: -2px;
//           font-size: 2.5rem;
//         }

//         .brand-accent {
//           color: #a78bfa; /* Soft Amethyst */
//         }

//         .brand-divider {
//           height: 3px;
//           width: 40px;
//           background: #a78bfa;
//           border-radius: 2px;
//         }

//         .brand-slogan {
//           color: #94a3b8;
//           font-size: 0.85rem;
//           text-transform: uppercase;
//           letter-spacing: 2px;
//         }

//         .obsidian-card {
//           background: rgba(255, 255, 255, 0.03);
//           backdrop-filter: blur(20px) saturate(150%);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 32px;
//           max-width: 420px;
//           width: 100%;
//         }

//         .pro-input {
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 14px;
//           padding: 14px 20px;
//           color: white;
//           font-size: 0.95rem;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .pro-input::placeholder { color: #4b5563; }

//         .pro-input:focus {
//           background: rgba(255, 255, 255, 0.08);
//           border-color: #a78bfa;
//           outline: none;
//           box-shadow: 0 0 20px rgba(167, 139, 250, 0.15);
//         }

//         .pro-btn {
//           background: #a78bfa;
//           color: #1e1b4b;
//           border: none;
//           border-radius: 14px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           transition: all 0.3s ease;
//         }

//         .pro-btn:hover {
//           background: #c4b5fd;
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(167, 139, 250, 0.4);
//         }

//         .pro-btn:disabled { opacity: 0.5; transform: none; }

//         .switch-btn {
//           background: none;
//           border: none;
//           color: #94a3b8;
//           font-weight: 600;
//           transition: 0.2s;
//         }

//         .switch-btn:hover { color: #a78bfa; }

//         .footer-text {
//           color: #4b5563;
//           font-size: 0.75rem;
//         }

//         .brand-container {
//           animation: slideDown 0.8s ease-out;
//         }

//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport vh-100 d-flex flex-column justify-content-center align-items-center px-4">
      {/* 🔹 BRAND IDENTITY */}
      <div className="text-center mb-5 animate-slide-down">
        <h1 className="brand-logo mb-0">
          Next<span className="brand-accent">Attend</span>
        </h1>
        <p className="brand-slogan">Secure Attendance Management</p>
      </div>
      {/* 🔹 GLOSSY GLASS CARD */}
      <div className="glass-card p-4 p-md-5 shadow-2xl">
        <h3 className="fw-bold text-white text-center mb-4">
          {isSignUp ? "Create Account" : "Member Sign In"}
        </h3>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              required
              className="glass-input mb-3 w-100"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            required
            type="email"
            className="glass-input mb-3 w-100"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            className="glass-input mb-4 w-100"
            placeholder="Secure Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="glass-btn w-100 py-3 fw-bold" disabled={loading}>
            {loading
              ? "AUTHENTICATING..."
              : isSignUp
                ? "JOIN NEXTATTEND"
                : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="switch-btn small"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already a member? Sign In"
              : "New here? Create your account"}
          </button>
        </div>
      </div>
      <footer className="mt-5 text-center footer-copy">
        <p>
          © {new Date().getFullYear()} NextAttend. Professional Edition. All
          rights reserved.
        </p>
      </footer>
      <style>{`
        .login-viewport {
          background: radial-gradient(circle at 80% 20%, #53355b 0%, #03070e 50%);
          background-color: #0a0a0c;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .brand-logo { color: #fff; font-weight: 800; letter-spacing: -2px; font-size: 2.8rem; }
        .brand-accent { color: #10b981; }
        .brand-slogan { color: #94a3b8; letter-spacing: 3px; font-size: 0.7rem; text-transform: uppercase; }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          max-width: 420px;
          width: 100%;
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 14px 20px;
          color: white;
          transition: 0.3s ease;
        }
        .glass-input:focus { border-color: #10b981; outline: none; box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
        .glass-btn {
          background: #10b981;
          color: #052c22;
          border: none;
          border-radius: 14px;
          transition: 0.3s;
        }
        .glass-btn:hover { background: #34d399; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
        .switch-btn { background: none; border: none; color: #94a3b8; transition: 0.2s; }
        .switch-btn:hover { color: #fff; }
        .footer-copy { color: #4b5563; font-size: 0.7rem; }
        .animate-slide-down { animation: slideDown 0.8s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
