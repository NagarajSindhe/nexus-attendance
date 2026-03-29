// import React, { useEffect, useState } from "react";
// import { auth } from "./firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import {
//   FaHome,
//   FaCalendarAlt,
//   FaChartBar,
//   FaShieldAlt,
//   FaSignOutAlt,
//   FaUmbrellaBeach,
//   FaBars,
//   FaTimes,
//   FaUserCircle 
// } from "react-icons/fa";

// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import CalendarView from "./components/CalendarView";
// import Reports from "./components/Reports";
// import AdminView from "./components/AdminView";
// import Holidays from "./components/Holidays";
// import logo from "/public/logo.png";
// import "./index.css";

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState("home");
//   const [loading, setLoading] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

//   const isAdmin = user?.email === "nagaraj.sindhe@gmail.com";

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setLoading(false);
//     });
//     return unsub;
//   }, []);

//   const toggleSidebar = (e) => {
//     e.stopPropagation();
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleNavClick = (id) => {
//     setActiveTab(id);
//     setIsSidebarOpen(false); 
//   };

//   if (loading)
//     return (
//       <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
//         <div className="spinner-border text-primary mb-2" role="status"></div>
//         <span className="text-muted fw-bold">NexusAttend</span>
//       </div>
//     );

//   if (!user) return <Login />;

//   const navItems = [
//     { id: "home", icon: <FaHome />, label: "Home" },
//     { id: "calendar", icon: <FaCalendarAlt />, label: "Calendar" },
//     { id: "reports", icon: <FaChartBar />, label: "Reports" },
//     { id: "holidays", icon: <FaUmbrellaBeach />, label: "Holidays" },
//     ...(isAdmin ? [{ id: "admin", icon: <FaShieldAlt />, label: "Admin" }] : []),
//   ];

//   return (
//     <div className="app-layout">
      
//       {/* 🔹 UNIFIED TOP NAVBAR */}
//       <nav className="navbar fixed-top glass-effect border-bottom px-3" style={{ zIndex: 2200, height: "70px" }}>
//         <div className="container-fluid d-flex justify-content-between align-items-center">
          
//           <div className="d-flex align-items-center gap-2">
//             <button 
//               className="btn btn-link text-dark p-0 border-0 d-lg-none me-2" 
//               onClick={toggleSidebar}
//               style={{ zIndex: 3000, position: 'relative' }}
//             >
//               {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
            
//             <div style={{ height: "50px", width: "180px" }} className="d-flex align-items-center">
//               <img src={logo} alt="Logo" style={{ height: "165px", margin: "-58px", objectFit: "contain" }} />
//             </div>
//           </div>

//           {/* 🔹 DESKTOP PROFILE & LOGOUT */}
//           <div className="d-none d-lg-flex align-items-center gap-3 bg-light px-3 py-1 rounded-pill border shadow-sm">
//             <div className="d-flex align-items-center gap-2 border-end pe-3">
//               <FaUserCircle size={22} className="text-primary" />
//               <span className="text-dark small fw-bold">{user.email.split('@')[0]}</span>
//             </div>
//             <button 
//               onClick={() => signOut(auth)} 
//               className="btn btn-link text-danger p-0 border-0 d-flex align-items-center hover-red"
//               title="Logout"
//             >
//               <FaSignOutAlt size={18} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* 🔹 SIDEBAR CONTAINER */}
//       <aside className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
//         <div className="sidebar-inner p-3 d-flex flex-column h-100">
//           <div className="flex-grow-1">
//             {navItems.map((item) => (
//               <div 
//                 key={item.id} 
//                 onClick={() => handleNavClick(item.id)} 
//                 className={`nav-item-link ${activeTab === item.id ? "nav-active" : ""}`}
//               >
//                 <span className="nav-icon">{item.icon}</span>
//                 <span className="ms-3 fw-bold">{item.label}</span>
//               </div>
//             ))}
//           </div>

//           {/* 🔹 MOBILE SIDEBAR FOOTER */}
//           <div className="sidebar-footer d-lg-none border-top pt-3 pb-4">
//             <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-4">
//               <div className="d-flex align-items-center gap-2 overflow-hidden">
//                 <FaUserCircle size={30} className="text-primary flex-shrink-0" />
//                 <div className="overflow-hidden">
//                   <p className="small fw-bold text-dark mb-0 text-truncate" style={{maxWidth: '120px'}}>
//                     {user.email.split('@')[0]}
//                   </p>
//                   <p className="text-muted mb-0" style={{ fontSize: '9px' }}>Online</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => signOut(auth)} 
//                 className="btn btn-outline-danger border-0 p-2 rounded-circle hover-red"
//               >
//                 <FaSignOutAlt size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* 🔹 MAIN WRAPPER */}
//       <div className="main-wrapper">
//         <main className="container-fluid py-4">
//           <div className="animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
//             {activeTab === "home" && <Dashboard user={user} />}
//             {activeTab === "calendar" && <CalendarView user={user} />}
//             {activeTab === "reports" && <Reports user={user} />}
//             {activeTab === "holidays" && <Holidays user={user} />}
//             {activeTab === "admin" && isAdmin && <AdminView />}
//           </div>
//         </main>
//       </div>

//       {isSidebarOpen && <div className="mobile-overlay d-lg-none" onClick={() => setIsSidebarOpen(false)}></div>}

//       <style>{`
//         .app-layout { min-height: 100vh; background: #fcfcfc; }
//         .sidebar-container {
//           width: 250px; background: white; border-right: 1px solid #f0f0f0;
//           position: fixed; top: 70px; bottom: 0; left: 0; z-index: 2000;
//           transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//         .main-wrapper { padding-top: 90px; margin-left: 250px; transition: margin-left 0.3s; }
//         .nav-item-link {
//           display: flex; align-items: center; padding: 14px 20px;
//           margin-bottom: 8px; border-radius: 12px; cursor: pointer;
//           color: #6c757d; transition: all 0.2s;
//         }
//         .nav-active { background: #e7f1ff; color: #0d6efd !important; border-left: 5px solid #0d6efd; }
//         .hover-red:hover { color: #dc3545 !important; transform: scale(1.1); transition: 0.2s; }
        
//         @media (max-width: 991px) {
//           .sidebar-container { 
//             transform: translateX(-100%); 
//             /* NEW: Starts below the navbar (70px) instead of top: 0 */
//             top: 70px; 
//             height: calc(100vh - 70px); 
//             z-index: 2500; 
//             box-shadow: 10px 0 15px rgba(0,0,0,0.05);
//           }
//           .sidebar-container.open { transform: translateX(0); }
//           .main-wrapper { margin-left: 0; }
          
//           /* NEW: Overlay also starts below the navbar so the logo remains clickable/visible */
//           .mobile-overlay { 
//             position: fixed; 
//             top: 70px; 
//             left: 0; 
//             right: 0; 
//             bottom: 0; 
//             background: rgba(0,0,0,0.3); 
//             z-index: 2400; 
//           }
//           .sidebar-footer { padding: 20px 15px; margin: 0 -5px; }
//         }

//         .animate-fade-in { animation: fadeIn 0.4s ease-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .glass-effect { background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(10px); }
//       `}</style>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  FaHome,
  FaCalendarAlt,
  FaChartBar,
  FaShieldAlt,
  FaSignOutAlt,
  FaUmbrellaBeach,
  FaBars,
  FaTimes,
  FaUserCircle 
} from "react-icons/fa";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CalendarView from "./components/CalendarView";
import Reports from "./components/Reports";
import AdminView from "./components/AdminView";
import Holidays from "./components/Holidays";
import logo from "/public/logo.png";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const isAdmin = user?.email === "nagaraj.sindhe@gmail.com";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsSidebarOpen(false); 
  };

  if (loading)
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white">
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <span className="text-muted fw-bold">NexusAttend</span>
      </div>
    );

  if (!user) return <Login />;

  const navItems = [
    { id: "home", icon: <FaHome />, label: "Home" },
    { id: "calendar", icon: <FaCalendarAlt />, label: "Calendar" },
    { id: "reports", icon: <FaChartBar />, label: "Reports" },
    { id: "holidays", icon: <FaUmbrellaBeach />, label: "Holidays" },
    ...(isAdmin ? [{ id: "admin", icon: <FaShieldAlt />, label: "Admin" }] : []),
  ];

  return (
    <div className="app-layout">
      
      {/* 🔹 UNIFIED TOP NAVBAR */}
      <nav className="navbar fixed-top glass-effect border-bottom px-3" style={{ zIndex: 2200, height: "70px" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          <div className="d-flex align-items-center gap-2">
            <button 
              className="btn btn-link text-dark p-0 border-0 d-lg-none me-2" 
              onClick={toggleSidebar}
              style={{ zIndex: 3000, position: 'relative' }}
            >
              {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            
            <div style={{ height: "50px", width: "180px" }} className="d-flex align-items-center">
              <img src={logo} alt="Logo" style={{ height: "165px", margin: "-58px", objectFit: "contain" }} />
            </div>
          </div>

          <div className="d-none d-lg-flex align-items-center gap-3 bg-white px-3 py-1 rounded-pill border shadow-sm">
            <div className="d-flex align-items-center gap-2 border-end pe-3">
              <FaUserCircle size={22} className="text-primary" />
              <span className="text-dark small fw-bold">{user.email.split('@')[0]}</span>
            </div>
            <button 
              onClick={() => signOut(auth)} 
              className="btn btn-link text-danger p-0 border-0 d-flex align-items-center hover-red"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* 🔹 SIDEBAR CONTAINER */}
      <aside className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-inner p-3 d-flex flex-column h-100">
          <div className="flex-grow-1">
            {navItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleNavClick(item.id)} 
                className={`nav-item-link ${activeTab === item.id ? "nav-active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="ms-3 fw-bold">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-footer d-lg-none border-top pt-3 pb-4">
            <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-4">
              <div className="d-flex align-items-center gap-2 overflow-hidden">
                <FaUserCircle size={30} className="text-primary flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="small fw-bold text-dark mb-0 text-truncate" style={{maxWidth: '120px'}}>
                    {user.email.split('@')[0]}
                  </p>
                  <p className="text-muted mb-0" style={{ fontSize: '9px' }}>Online</p>
                </div>
              </div>
              <button onClick={() => signOut(auth)} className="btn btn-outline-danger border-0 p-2 rounded-circle hover-red">
                <FaSignOutAlt size={20} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 🔹 MAIN WRAPPER */}
      <div className="main-wrapper">
        <main className="container-fluid py-4 px-md-5">
          <div className="content-card animate-fade-in">
            {activeTab === "home" && <Dashboard user={user} />}
            {activeTab === "calendar" && <CalendarView user={user} />}
            {activeTab === "reports" && <Reports user={user} />}
            {activeTab === "holidays" && <Holidays user={user} />}
            {activeTab === "admin" && isAdmin && <AdminView />}
          </div>
        </main>
      </div>

      {isSidebarOpen && <div className="mobile-overlay d-lg-none" onClick={() => setIsSidebarOpen(false)}></div>}

      <style>{`
        /* 🎨 Professional Gradient Background */
        .app-layout { 
          min-height: 100vh; 
          // background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
          background-attachment: fixed;
        }

        .sidebar-container {
          width: 260px; 
          background: #fff;
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(0,0,0,0.05);
          position: fixed; top: 70px; bottom: 0; left: 0; z-index: 2000;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .main-wrapper { padding-top: 85px; margin-left: 260px; transition: margin-left 0.3s; }
        
        /* 📄 Content Card for Professional Look */
        .content-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          max-width: 1100px;
          margin: 0 auto;
          // border: 1px solid rgba(255,255,255,0.8);
        }

        .nav-item-link {
          display: flex; align-items: center; padding: 12px 18px;
          margin-bottom: 6px; border-radius: 12px; cursor: pointer;
          color: #64748b; transition: all 0.2s ease;
        }
        .nav-item-link:hover { background: rgba(13, 110, 253, 0.05); color: #0d6efd; }
        .nav-active { background: #0d6efd !important; color: white !important; box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2); }
        
        .hover-red:hover { color: #dc3545 !important; transform: scale(1.1); transition: 0.2s; }
        
        @media (max-width: 991px) {
          .sidebar-container { 
            transform: translateX(-100%); 
            top: 70px; 
            height: calc(100vh - 70px); 
            z-index: 2500; 
            background: white;
            box-shadow: 15px 0 30px rgba(0,0,0,0.1);
          }
          .sidebar-container.open { transform: translateX(0); }
          .main-wrapper { margin-left: 0; padding-top: 80px; }
          .content-card { padding: 15px; border-radius: 0; background: transparent; box-shadow: none; }
          .mobile-overlay { position: fixed; top: 70px; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); z-index: 2400; backdrop-filter: blur(2px); }
        }

        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .glass-effect { background: rgba(255, 255, 255, 0.85) !important; backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
      `}</style>
    </div>
  );
}
