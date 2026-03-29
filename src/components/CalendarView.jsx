// import React, { useEffect, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { FaLock, FaChevronLeft, FaChevronRight, FaCalendarCheck } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     return new Date(date.setDate(diff));
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear) {
//       return alert(`Access restricted to ${currentYear} only.`);
//     }
//     setCurrentMonday(newMonday);
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//     try {
//       await setDoc(weekRef, {
//         weekId: currentWeekId,
//         userId: user.uid,
//         days: finalSubmission,
//         location: USER_LOCATION,
//         submittedAt: new Date(),
//       }, { merge: true });
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Success: Timesheet synchronized.");
//     } catch (e) {
//       console.error(e);
//     }
//     setLoading(false);
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div className="container py-4 px-2 px-md-4" style={{ maxWidth: "1200px", minHeight: "100vh", backgroundColor: "#f4f7fa" }}>

//       {/* 🔹 Header Section */}
//       <div className="bg-white p-4 rounded-4 shadow-sm border-0 mb-4 sticky-top" style={{ zIndex: 10, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
//         <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//           <div>
//             <h3 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
//                <FaCalendarCheck className="text-primary" /> {currentMonthDisplay}
//             </h3>
//             <div className="d-flex align-items-center gap-2">
//               <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill">{currentWeekId}</span>
//               <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill">{USER_LOCATION}</span>
//             </div>
//           </div>

//           <div className="d-flex align-items-center gap-2">
//             <div className="btn-group bg-light p-1 rounded-pill shadow-sm border">
//               <button onClick={() => changeWeek(-7)} className="btn btn-sm btn-white border-0 rounded-pill px-3 shadow-none"><FaChevronLeft size={10}/></button>
//               <button onClick={() => setCurrentMonday(getMonday(today))} className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold shadow-none" style={{fontSize: '12px'}}>TODAY</button>
//               <button onClick={() => changeWeek(7)} className="btn btn-sm btn-white border-0 rounded-pill px-3 shadow-none"><FaChevronRight size={10}/></button>
//             </div>
//             {isLocked ? (
//               <button onClick={() => setIsLocked(false)} className="btn btn-sm btn-dark rounded-pill px-4 py-2 shadow-sm fw-bold">Edit Week</button>
//             ) : (
//               <button onClick={submitWeek} disabled={loading} className="btn btn-sm btn-primary rounded-pill px-4 py-2 shadow-sm fw-bold border-0" style={{ backgroundColor: "#4f46e5" }}>
//                 {loading ? "Syncing..." : "Submit Logs"}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 🔹 Grid Layout */}
//       <div className="row g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-7">
//         {selectedWeek.map((d, i) => {
//           const isToday = d.date === formatDate(today);
//           const isFuture = d.date > formatDate(today);
//           const holiday = holidays.find((h) => h.date === d.date);
//           const status = weekData[d.date];
//           const isWeekend = d.day === 0 || d.day === 6;

//           // 🔹 Header Style Logic
//           let headerBg = "#f8fafc"; // Default Weekday
//           let headerColor = "#64748b";

//           if (isToday) {
//             headerBg = "#4f46e5"; // Highlight Today
//             headerColor = "#ffffff";
//           } else if (isWeekend) {
//             headerBg = "#e2e8f0"; // Weekend Color (Light Slate)
//             headerColor = "#475569";
//           } else if (isFuture) {
//             headerBg = "#f1f5f9";
//             headerColor = "#94a3b8";
//           }

//           const getStatusClass = (s) => {
//             if (s === 'In-Office') return 'bg-success-subtle text-success border-success-subtle';
//             if (s === 'Remote') return 'bg-info-subtle text-info border-info-subtle';
//             if (s === 'Leave') return 'bg-danger-subtle text-danger border-danger-subtle';
//             return 'bg-light text-muted border-light';
//           };

//           return (
//             <div key={i} className="col">
//               <div className="card h-100 border-0 shadow-sm text-center position-relative overflow-hidden card-hover" style={{
//                 borderRadius: "20px",
//                 backgroundColor: isFuture ? "#fcfcfc" : "#ffffff",
//                 border: isToday ? "2px solid #4f46e5" : "1px solid #f1f5f9",
//                 minHeight: "240px",
//                 opacity: isFuture ? 0.7 : 1,
//                 transition: "all 0.3s ease"
//               }}>
//                 {/* 🔹 Dynamic Header Strip */}
//                 <div className="py-2 small fw-bold text-uppercase tracking-wider" style={{
//                   backgroundColor: headerBg,
//                   color: headerColor,
//                   fontSize: "10px",
//                   borderBottom: '1px solid rgba(0,0,0,0.05)'
//                 }}>
//                   {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
//                 </div>

//                 <div className="p-3 d-flex flex-column h-100">
//                   <h4 className="fw-bold mb-0 text-dark">{new Date(d.date).getDate()}</h4>
//                   <div className="text-muted small mb-3 fw-medium">
//                     {new Date(d.date).toLocaleDateString("en-US", { month: "short" })}
//                   </div>

//                   <div className="mt-auto">
//                     {holiday && <div className="text-warning fw-bold mb-2" style={{ fontSize: "9px" }}>● {holiday.name}</div>}

//                     {isFuture ? (
//                       <div className="text-muted py-2"><FaLock className="opacity-25" size={12}/></div>
//                     ) : (isLocked || isWeekend || holiday) ? (
//                       <div className={`badge w-100 py-2 border rounded-3 text-truncate ${getStatusClass(status)}`} style={{ fontSize: "10px", fontWeight: '700' }}>
//                         {status || (isWeekend ? "WEEKEND" : holiday ? "HOLIDAY" : "MISSING")}
//                       </div>
//                     ) : (
//                       <div className="d-flex flex-column gap-1">
//                         {statusOptions.map((opt) => (
//                           <button
//                             key={opt}
//                             className={`btn btn-sm py-2 px-0 rounded-3 border-0 fw-bold transition-all ${status === opt ? 'bg-primary text-white shadow-sm' : 'bg-light text-dark'}`}
//                             style={{ fontSize: "10px" }}
//                             onClick={() => setWeekData({ ...weekData, [d.date]: opt })}
//                           >
//                             {opt}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <style>{`
//         .bg-success-subtle { background-color: #e8f5e9 !important; }
//         .bg-info-subtle { background-color: #e3f2fd !important; }
//         .bg-danger-subtle { background-color: #ffebee !important; }
//         .card-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
//         .transition-all { transition: all 0.2s ease-in-out; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { FaLock, FaChevronLeft, FaChevronRight, FaCalendarCheck, FaCheck } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     return new Date(date.setDate(diff));
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);

//   const getDayTheme = (dayIndex, isToday) => {
//     if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" }; // Modern Indigo
//     const themes = {
//       1: { header: "#3b82f6", bg: "#eff6ff" }, // Mon - Blue
//       2: { header: "#8b5cf6", bg: "#f5f3ff" }, // Tue - Violet
//       3: { header: "#d946ef", bg: "#fdf4ff" }, // Wed - Fuchsia
//       4: { header: "#f59e0b", bg: "#fffbeb" }, // Thu - Amber
//       5: { header: "#10b981", bg: "#f0fdf4" }, // Fri - Emerald
//       6: { header: "#64748b", bg: "#f8fafc" }, // Sat - Slate
//       0: { header: "#ef4444", bg: "#fef2f2" }, // Sun - Rose
//     };
//     return themes[dayIndex];
//   };

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear) return alert(`Restricted to ${currentYear} logs.`);
//     setCurrentMonday(newMonday);
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     try {
//       const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       await setDoc(weekRef, {
//         weekId: currentWeekId,
//         userId: user.uid,
//         days: finalSubmission,
//         location: USER_LOCATION,
//         submittedAt: new Date(),
//       }, { merge: true });
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Compliance data synced.");
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div className="container-fluid py-4 px-3 px-md-5" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

//       {/* 🔹 Professional Navigation Header */}
//       <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
//         <div className="card border-0 shadow-sm rounded-4 p-3" style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)" }}>
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//             <div>
//               <div className="d-flex align-items-center gap-2 mb-1">
//                 <FaCalendarCheck className="text-primary" size={20} />
//                 <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.5px" }}>{currentMonthDisplay}</h4>
//               </div>
//               <div className="d-flex gap-2">
//                 <span className="badge bg-white text-muted border px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{currentWeekId}</span>
//                 <span className="badge bg-primary-subtle text-primary border-primary-subtle px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{USER_LOCATION}</span>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3">
//               <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
//                 <button onClick={() => changeWeek(-7)} className="btn btn-sm btn-light border-0 rounded-pill px-3"><FaChevronLeft size={10}/></button>
//                 <button onClick={() => setCurrentMonday(getMonday(today))} className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold text-uppercase" style={{fontSize: '10px', letterSpacing: '1px'}}>Today</button>
//                 <button onClick={() => changeWeek(7)} className="btn btn-sm btn-light border-0 rounded-pill px-3"><FaChevronRight size={10}/></button>
//               </div>

//               {isLocked ? (
//                 <button onClick={() => setIsLocked(false)} className="btn btn-sm btn-dark rounded-pill px-4 py-2 fw-bold shadow-sm border-0">Edit</button>
//               ) : (
//                 <button onClick={submitWeek} disabled={loading} className="btn btn-sm btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm border-0" style={{ backgroundColor: "#4f46e5" }}>
//                   {loading ? "Syncing..." : "submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🔹 Calendar Grid */}
//       <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-7">
//         {selectedWeek.map((d, i) => {
//           const isToday = d.date === formatDate(today);
//           const isFuture = d.date > formatDate(today);
//           const holiday = holidays.find((h) => h.date === d.date);
//           const status = weekData[d.date];
//           const theme = getDayTheme(d.day, isToday);

//           return (
//             <div key={i} className="col">
//               <div className={`card h-100 border-0 shadow-sm text-center position-relative overflow-hidden card-transition ${isFuture ? 'future-card' : ''}`} style={{
//                 borderRadius: "24px",
//                 backgroundColor: isFuture ? "#f1f5f9" : "#ffffff",
//                 border: isToday ? "2px solid #4f46e5" : "1px solid rgba(0,0,0,0.04)",
//                 minHeight: "280px"
//               }}>
//                 {/* Visual Header */}
//                 <div className="py-2 small fw-bold text-uppercase" style={{
//                   backgroundColor: isFuture ? "#e2e8f0" : theme.header,
//                   color: "#fff",
//                   fontSize: "10px",
//                   letterSpacing: "1.5px"
//                 }}>
//                   {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
//                 </div>

//                 <div className="p-4 d-flex flex-column h-100">
//                   <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-1px" }}>{new Date(d.date).getDate()}</h2>
//                   <div className="text-muted small mb-4 fw-medium text-uppercase">{new Date(d.date).toLocaleDateString("en-US", { month: "short" })}</div>

//                   <div className="mt-auto">
//                     {holiday && <div className="text-warning fw-bold mb-3" style={{ fontSize: "9px" }}>● {holiday.name}</div>}

//                     {isFuture ? (
//                       <div className="text-muted py-3">
//                         <FaLock className="opacity-25 mb-2" size={14}/>
//                         <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>LOCKED</div>
//                       </div>
//                     ) : (isLocked || d.day === 0 || d.day === 6 || holiday) ? (
//                       <div className={`py-2 px-3 rounded-pill fw-bold border text-truncate ${status === 'In-Office' ? 'bg-success-subtle text-success border-success' : 'bg-light text-muted'}`} style={{ fontSize: "10px" }}>
//                         {status || (d.day === 0 || d.day === 6 ? "WEEKEND" : holiday ? "HOLIDAY" : "PENDING")}
//                       </div>
//                     ) : (
//                       <div className="d-flex flex-column gap-2">
//                         {statusOptions.map((opt) => (
//                           <button
//                             key={opt}
//                             className={`btn btn-sm py-2 px-0 rounded-pill border-0 fw-bold transition-all ${status === opt ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
//                             style={{ fontSize: "10px" }}
//                             onClick={() => setWeekData({ ...weekData, [d.date]: opt })}
//                           >
//                             {status === opt && <FaCheck size={8} className="me-1"/>} {opt}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <style>{`
//         .card-transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
//         .card-transition:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important; }
//         .future-card { filter: grayscale(0.5); border: 2px dashed #cbd5e1 !important; }
//         .transition-all { transition: all 0.2s ease; }
//         .bg-success-subtle { background-color: #f0fdf4; color: #15803d; border-color: #bcf0da !important; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { FaLock, FaChevronLeft, FaChevronRight, FaCalendarCheck, FaCheck, FaCalendarAlt } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     return new Date(date.setDate(diff));
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);

//   const getDayTheme = (dayIndex, isToday) => {
//     if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" };
//     const themes = {
//       1: { header: "#3b82f6", bg: "#eff6ff" },
//       2: { header: "#8b5cf6", bg: "#f5f3ff" },
//       3: { header: "#d946ef", bg: "#fdf4ff" },
//       4: { header: "#f59e0b", bg: "#fffbeb" },
//       5: { header: "#10b981", bg: "#f0fdf4" },
//       6: { header: "#64748b", bg: "#f8fafc" },
//       0: { header: "#ef4444", bg: "#fef2f2" },
//     };
//     return themes[dayIndex];
//   };

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear) return alert(`Restricted to ${currentYear} logs.`);
//     setCurrentMonday(newMonday);
//   };

//   // 🔹 JUMP TO SPECIFIC MONTH LOGIC
//   const handleMonthChange = (e) => {
//     const selectedDate = new Date(e.target.value + "-01"); // Treat as 1st of month
//     if (selectedDate.getFullYear() !== currentYear) {
//         return alert(`Please select a month within ${currentYear}.`);
//     }
//     setCurrentMonday(getMonday(selectedDate));
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     try {
//       const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       await setDoc(weekRef, {
//         weekId: currentWeekId,
//         userId: user.uid,
//         days: finalSubmission,
//         location: USER_LOCATION,
//         submittedAt: new Date(),
//       }, { merge: true });
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Compliance data synced.");
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div className="container-fluid py-4 px-3 px-md-5" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

//       <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
//         <div className="card border-0 shadow-sm rounded-4 p-3" style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)" }}>
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

//             {/* 🔹 Enhanced Header with Month Selector */}
//             <div className="position-relative">
//               <label className="d-flex align-items-center gap-2 mb-1 cursor-pointer" htmlFor="monthPicker">
//                 <FaCalendarAlt className="text-primary" size={18} />
//                 <h4 className="fw-bold mb-0 text-dark hover-underline" style={{ letterSpacing: "-0.5px" }}>
//                   {currentMonthDisplay}
//                 </h4>
//                 <input
//                   type="month"
//                   id="monthPicker"
//                   className="position-absolute opacity-0"
//                   style={{ width: '100%', left: 0, top: 0, cursor: 'pointer' }}
//                   onChange={handleMonthChange}
//                   min={`${currentYear}-01`}
//                   max={`${currentYear}-12`}
//                 />
//               </label>
//               <div className="d-flex gap-2">
//                 <span className="badge bg-white text-muted border px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{currentWeekId}</span>
//                 <span className="badge bg-primary-subtle text-primary border-primary-subtle px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{USER_LOCATION}</span>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3">
//               <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
//                 <button onClick={() => changeWeek(-7)} className="btn btn-sm btn-light border-0 rounded-pill px-3"><FaChevronLeft size={10}/></button>
//                 <button onClick={() => setCurrentMonday(getMonday(today))} className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold text-uppercase" style={{fontSize: '10px', letterSpacing: '1px'}}>Today</button>
//                 <button onClick={() => changeWeek(7)} className="btn btn-sm btn-light border-0 rounded-pill px-3"><FaChevronRight size={10}/></button>
//               </div>

//               {isLocked ? (
//                 <button onClick={() => setIsLocked(false)} className="btn btn-sm btn-dark rounded-pill px-4 py-2 fw-bold shadow-sm border-0">Edit</button>
//               ) : (
//                 <button onClick={submitWeek} disabled={loading} className="btn btn-sm btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm border-0" style={{ backgroundColor: "#4f46e5" }}>
//                   {loading ? "Syncing..." : "Submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-7">
//         {selectedWeek.map((d, i) => {
//           const isToday = d.date === formatDate(today);
//           const isFuture = d.date > formatDate(today);
//           const holiday = holidays.find((h) => h.date === d.date);
//           const status = weekData[d.date];
//           const theme = getDayTheme(d.day, isToday);

//           return (
//             <div key={i} className="col">
//               <div className={`card h-100 border-0 shadow-sm text-center position-relative overflow-hidden card-transition ${isFuture ? 'future-card' : ''}`} style={{
//                 borderRadius: "24px",
//                 backgroundColor: isFuture ? "#f1f5f9" : "#ffffff",
//                 border: isToday ? "2px solid #4f46e5" : "1px solid rgba(0,0,0,0.04)",
//                 minHeight: "280px"
//               }}>
//                 <div className="py-2 small fw-bold text-uppercase" style={{
//                   backgroundColor: isFuture ? "#e2e8f0" : theme.header,
//                   color: "#fff",
//                   fontSize: "10px",
//                   letterSpacing: "1.5px"
//                 }}>
//                   {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
//                 </div>

//                 <div className="p-4 d-flex flex-column h-100">
//                   <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-1px" }}>{new Date(d.date).getDate()}</h2>
//                   <div className="text-muted small mb-4 fw-medium text-uppercase">{new Date(d.date).toLocaleDateString("en-US", { month: "short" })}</div>

//                   <div className="mt-auto">
//                     {holiday && <div className="text-warning fw-bold mb-3" style={{ fontSize: "9px" }}>● {holiday.name}</div>}

//                     {isFuture ? (
//                       <div className="text-muted py-3">
//                         <FaLock className="opacity-25 mb-2" size={14}/>
//                         <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>LOCKED</div>
//                       </div>
//                     ) : (isLocked || d.day === 0 || d.day === 6 || holiday) ? (
//                       <div className={`py-2 px-3 rounded-pill fw-bold border text-truncate ${status === 'In-Office' ? 'bg-success-subtle text-success border-success' : 'bg-light text-muted'}`} style={{ fontSize: "10px" }}>
//                         {status || (d.day === 0 || d.day === 6 ? "WEEKEND" : holiday ? "HOLIDAY" : "PENDING")}
//                       </div>
//                     ) : (
//                       <div className="d-flex flex-column gap-2">
//                         {statusOptions.map((opt) => (
//                           <button
//                             key={opt}
//                             className={`btn btn-sm py-2 px-0 rounded-pill border-0 fw-bold transition-all ${status === opt ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
//                             style={{ fontSize: "10px" }}
//                             onClick={() => setWeekData({ ...weekData, [d.date]: opt })}
//                           >
//                             {status === opt && <FaCheck size={8} className="me-1"/>} {opt}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .hover-underline:hover { text-decoration: underline; color: #4f46e5; }
//         .card-transition { transition: all 0.3s ease; }
//         .future-card { opacity: 0.6; filter: grayscale(0.2); }
//         .bg-success-subtle { background-color: #f0fdf4; color: #16a34a; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { FaLock, FaChevronLeft, FaChevronRight, FaCalendarCheck, FaCheck, FaCalendarAlt } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     return new Date(date.setDate(diff));
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);

//   const getDayTheme = (dayIndex, isToday) => {
//     if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" };
//     const themes = {
//       1: { header: "#3b82f6", bg: "#eff6ff" },
//       2: { header: "#8b5cf6", bg: "#f5f3ff" },
//       3: { header: "#d946ef", bg: "#fdf4ff" },
//       4: { header: "#f59e0b", bg: "#fffbeb" },
//       5: { header: "#10b981", bg: "#f0fdf4" },
//       6: { header: "#64748b", bg: "#f8fafc" },
//       0: { header: "#ef4444", bg: "#fef2f2" },
//     };
//     return themes[dayIndex];
//   };

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear) return alert(`Restricted to ${currentYear} logs.`);
//     setCurrentMonday(newMonday);
//   };

//   // 🔹 JUMP TO WEEK BY SELECTING ANY DATE
//   const handleDateJump = (e) => {
//     const selectedDate = new Date(e.target.value);
//     if (selectedDate.getFullYear() !== currentYear) {
//         return alert(`Please select a date within ${currentYear}.`);
//     }
//     // Convert selected date to its corresponding Monday to jump to that week
//     setCurrentMonday(getMonday(selectedDate));
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     try {
//       const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       await setDoc(weekRef, {
//         weekId: currentWeekId,
//         userId: user.uid,
//         days: finalSubmission,
//         location: USER_LOCATION,
//         submittedAt: new Date(),
//       }, { merge: true });
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Compliance data synced.");
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div className="container-fluid py-4 px-3 px-md-5" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

//       <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
//         <div className="card border-0 shadow-sm rounded-4 p-3" style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)" }}>
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

//             {/* 🔹 Date Selector Header */}
//             <div className="position-relative">
//               <label className="d-flex align-items-center gap-2 mb-1 cursor-pointer" htmlFor="weekJumpPicker">
//                 <FaCalendarAlt className="text-primary" size={18} />
//                 <h4 className="fw-bold mb-0 text-dark hover-underline" style={{ letterSpacing: "-0.5px" }}>
//                   {currentMonthDisplay}
//                 </h4>
//                 {/* Invisible input that covers the header to act as a trigger */}
//                 <input
//                   type="date"
//                   id="weekJumpPicker"
//                   className="position-absolute opacity-0"
//                   style={{ width: '100%', left: 0, top: 0, cursor: 'pointer' }}
//                   onChange={handleDateJump}
//                   min={`${currentYear}-01-01`}
//                   max={`${currentYear}-12-31`}
//                 />
//               </label>
//               <div className="d-flex gap-2">
//                 <span className="badge bg-white text-muted border px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{currentWeekId}</span>
//                 <span className="badge bg-primary-subtle text-primary border-primary-subtle px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{USER_LOCATION}</span>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3">
//               <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
//                 <button onClick={() => changeWeek(-7)} className="btn btn-sm btn-light border-0 rounded-pill px-3"><FaChevronLeft size={10}/></button>
//                 <button onClick={() => setCurrentMonday(getMonday(today))} className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold text-uppercase" style={{fontSize: '10px', letterSpacing: '1px'}}>Today</button>
//                 <button onClick={() => changeWeek(7)} className="btn btn-sm btn-light border-0 rounded-pill px-3"><FaChevronRight size={10}/></button>
//               </div>

//               {isLocked ? (
//                 <button onClick={() => setIsLocked(false)} className="btn btn-sm btn-dark rounded-pill px-4 py-2 fw-bold shadow-sm border-0">Edit</button>
//               ) : (
//                 <button onClick={submitWeek} disabled={loading} className="btn btn-sm btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm border-0" style={{ backgroundColor: "#4f46e5" }}>
//                   {loading ? "Syncing..." : "Submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-7">
//         {selectedWeek.map((d, i) => {
//           const isToday = d.date === formatDate(today);
//           const isFuture = d.date > formatDate(today);
//           const holiday = holidays.find((h) => h.date === d.date);
//           const status = weekData[d.date];
//           const theme = getDayTheme(d.day, isToday);

//           return (
//             <div key={i} className="col">
//               <div className={`card h-100 border-0 shadow-sm text-center position-relative overflow-hidden card-transition ${isFuture ? 'future-card' : ''}`} style={{
//                 borderRadius: "24px",
//                 backgroundColor: isFuture ? "#f1f5f9" : "#ffffff",
//                 border: isToday ? "2px solid #4f46e5" : "1px solid rgba(0,0,0,0.04)",
//                 minHeight: "280px"
//               }}>
//                 <div className="py-2 small fw-bold text-uppercase" style={{
//                   backgroundColor: isFuture ? "#e2e8f0" : theme.header,
//                   color: "#fff",
//                   fontSize: "10px",
//                   letterSpacing: "1.5px"
//                 }}>
//                   {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
//                 </div>

//                 <div className="p-4 d-flex flex-column h-100">
//                   <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-1px" }}>{new Date(d.date).getDate()}</h2>
//                   <div className="text-muted small mb-4 fw-medium text-uppercase">{new Date(d.date).toLocaleDateString("en-US", { month: "short" })}</div>

//                   <div className="mt-auto">
//                     {holiday && <div className="text-warning fw-bold mb-3" style={{ fontSize: "9px" }}>● {holiday.name}</div>}

//                     {isFuture ? (
//                       <div className="text-muted py-3">
//                         <FaLock className="opacity-25 mb-2" size={14}/>
//                         <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>LOCKED</div>
//                       </div>
//                     ) : (isLocked || d.day === 0 || d.day === 6 || holiday) ? (
//                       <div className={`py-2 px-3 rounded-pill fw-bold border text-truncate ${status === 'In-Office' ? 'bg-success-subtle text-success border-success' : 'bg-light text-muted'}`} style={{ fontSize: "10px" }}>
//                         {status || (d.day === 0 || d.day === 6 ? "WEEKEND" : holiday ? "HOLIDAY" : "PENDING")}
//                       </div>
//                     ) : (
//                       <div className="d-flex flex-column gap-2">
//                         {statusOptions.map((opt) => (
//                           <button
//                             key={opt}
//                             className={`btn btn-sm py-2 px-0 rounded-pill border-0 fw-bold transition-all ${status === opt ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
//                             style={{ fontSize: "10px" }}
//                             onClick={() => setWeekData({ ...weekData, [d.date]: opt })}
//                           >
//                             {status === opt && <FaCheck size={8} className="me-1"/>} {opt}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <style>{`
//         .cursor-pointer { cursor: pointer; }
//         .hover-underline:hover { text-decoration: underline; color: #4f46e5; }
//         .card-transition { transition: all 0.3s ease; }
//         .future-card { opacity: 0.6; filter: grayscale(0.2); }
//         .bg-success-subtle { background-color: #f0fdf4; color: #16a34a; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { FaLock, FaChevronLeft, FaChevronRight, FaCalendarCheck, FaCheck, FaCalendarAlt } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   // 🔹 Create a Ref to trigger the hidden input
//   const dateInputRef = useRef(null);

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     return new Date(date.setDate(diff));
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);

//   const getDayTheme = (dayIndex, isToday) => {
//     if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" };
//     const themes = {
//       1: { header: "#3b82f6", bg: "#eff6ff" },
//       2: { header: "#8b5cf6", bg: "#f5f3ff" },
//       3: { header: "#d946ef", bg: "#fdf4ff" },
//       4: { header: "#f59e0b", bg: "#fffbeb" },
//       5: { header: "#10b981", bg: "#f0fdf4" },
//       6: { header: "#64748b", bg: "#f8fafc" },
//       0: { header: "#ef4444", bg: "#fef2f2" },
//     };
//     return themes[dayIndex];
//   };

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", { month: "long", year: "numeric" });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear) return alert(`Restricted to ${currentYear} logs.`);
//     setCurrentMonday(newMonday);
//   };

//   // 🔹 Triggered when a date is selected from the picker
//   const handleDateJump = (e) => {
//     const selectedValue = e.target.value;
//     if (!selectedValue) return;

//     const selectedDate = new Date(selectedValue);
//     if (selectedDate.getFullYear() !== currentYear) {
//         return alert(`Please select a date within ${currentYear}.`);
//     }
//     setCurrentMonday(getMonday(selectedDate));
//   };

//   // 🔹 Function to open the calendar picker programmatically
//   const openCalendar = () => {
//     if (dateInputRef.current) {
//         // Modern browsers support showPicker()
//         if (dateInputRef.current.showPicker) {
//             dateInputRef.current.showPicker();
//         } else {
//             dateInputRef.current.click();
//         }
//     }
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     try {
//       const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       await setDoc(weekRef, {
//         weekId: currentWeekId,
//         userId: user.uid,
//         days: finalSubmission,
//         location: USER_LOCATION,
//         submittedAt: new Date(),
//       }, { merge: true });
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Compliance data synced.");
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div className="container-fluid py-4 px-3 px-md-5" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

//       <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
//         <div className="card border-0 shadow-sm rounded-4 p-3" style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)" }}>
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

//             {/* 🔹 Fixed Date Selector Header */}
//             <div className="position-relative">
//               <div
//                 className="d-flex align-items-center gap-2 mb-1 cursor-pointer"
//                 onClick={openCalendar}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <FaCalendarAlt className="text-primary" size={18} />
//                 <h4 className="fw-bold mb-0 text-dark hover-indigo" style={{ letterSpacing: "-0.5px" }}>
//                   {currentMonthDisplay}
//                 </h4>
//                 {/* Hidden input field */}
//                 <input
//                   type="date"
//                   ref={dateInputRef}
//                   className="position-absolute"
//                   style={{ visibility: 'hidden', width: 0, height: 0 }}
//                   onChange={handleDateJump}
//                   min={`${currentYear}-01-01`}
//                   max={`${currentYear}-12-31`}
//                 />
//               </div>
//               <div className="d-flex gap-2">
//                 <span className="badge bg-white text-muted border px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{currentWeekId}</span>
//                 <span className="badge bg-primary-subtle text-primary border-primary-subtle px-3 rounded-pill fw-medium" style={{ fontSize: '11px' }}>{USER_LOCATION}</span>
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3">
//               <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
//                 <button onClick={() => changeWeek(-7)} className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"><FaChevronLeft size={10}/></button>
//                 <button onClick={() => setCurrentMonday(getMonday(today))} className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold text-uppercase" style={{fontSize: '10px', letterSpacing: '1px'}}>Today</button>
//                 <button onClick={() => changeWeek(7)} className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"><FaChevronRight size={10}/></button>
//               </div>

//               {isLocked ? (
//                 <button onClick={() => setIsLocked(false)} className="btn btn-sm btn-dark rounded-pill px-4 py-2 shadow-sm border-0">Edit</button>
//               ) : (
//                 <button onClick={submitWeek} disabled={loading} className="btn btn-sm btn-primary rounded-pill px-4 py-2 shadow-sm border-0" style={{ backgroundColor: "#4f46e5" }}>
//                   {loading ? "..." : "Submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-7">
//         {selectedWeek.map((d, i) => {
//           const isToday = d.date === formatDate(today);
//           const isFuture = d.date > formatDate(today);
//           const holiday = holidays.find((h) => h.date === d.date);
//           const status = weekData[d.date];
//           const theme = getDayTheme(d.day, isToday);

//           return (
//             <div key={i} className="col">
//               <div className={`card h-100 border-0 shadow-sm text-center position-relative overflow-hidden card-transition ${isFuture ? 'future-card' : ''}`} style={{
//                 borderRadius: "24px",
//                 backgroundColor: isFuture ? "#f1f5f9" : "#ffffff",
//                 border: isToday ? "2px solid #4f46e5" : "1px solid rgba(0,0,0,0.04)",
//                 minHeight: "280px"
//               }}>
//                 <div className="py-2 small fw-bold text-uppercase" style={{
//                   backgroundColor: isFuture ? "#e2e8f0" : theme.header,
//                   color: "#fff",
//                   fontSize: "10px",
//                   letterSpacing: "1.5px"
//                 }}>
//                   {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
//                 </div>

//                 <div className="p-4 d-flex flex-column h-100">
//                   <h2 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-1px" }}>{new Date(d.date).getDate()}</h2>
//                   <div className="text-muted small mb-4 fw-medium text-uppercase">{new Date(d.date).toLocaleDateString("en-US", { month: "short" })}</div>

//                   <div className="mt-auto">
//                     {holiday && <div className="text-warning fw-bold mb-3" style={{ fontSize: "9px" }}>● {holiday.name}</div>}

//                     {isFuture ? (
//                       <div className="text-muted py-3">
//                         <FaLock className="opacity-25 mb-2" size={14}/>
//                         <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '1px' }}>LOCKED</div>
//                       </div>
//                     ) : (isLocked || d.day === 0 || d.day === 6 || holiday) ? (
//                       <div className={`py-2 px-3 rounded-pill fw-bold border text-truncate ${status === 'In-Office' ? 'bg-success-subtle text-success border-success' : 'bg-light text-muted'}`} style={{ fontSize: "10px" }}>
//                         {status || (d.day === 0 || d.day === 6 ? "WEEKEND" : holiday ? "HOLIDAY" : "PENDING")}
//                       </div>
//                     ) : (
//                       <div className="d-flex flex-column gap-2">
//                         {statusOptions.map((opt) => (
//                           <button
//                             key={opt}
//                             className={`btn btn-sm py-2 px-0 rounded-pill border-0 fw-bold transition-all ${status === opt ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
//                             style={{ fontSize: "10px" }}
//                             onClick={() => setWeekData({ ...weekData, [d.date]: opt })}
//                           >
//                             {status === opt && <FaCheck size={8} className="me-1"/>} {opt}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <style>{`
//         .cursor-pointer:hover .hover-indigo { color: #4f46e5 !important; text-decoration: underline; }
//         .card-transition { transition: all 0.3s ease; }
//         .future-card { opacity: 0.6; filter: grayscale(0.2); }
//         .bg-success-subtle { background-color: #f0fdf4; color: #16a34a; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import {
//   FaLock,
//   FaChevronLeft,
//   FaChevronRight,
//   FaCalendarCheck,
//   FaCheck,
//   FaCalendarAlt,
//   FaMousePointer,
// } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   const dateInputRef = useRef(null);

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     return new Date(date.setDate(diff));
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);
//   const [isFutureS, setFuture] = useState(false);

//   const getDayTheme = (dayIndex, isToday) => {
//     if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" };
//     const themes = {
//       1: { header: "#3b82f6", bg: "#eff6ff" },
//       2: { header: "#8b5cf6", bg: "#f5f3ff" },
//       3: { header: "#d946ef", bg: "#fdf4ff" },
//       4: { header: "#f59e0b", bg: "#fffbeb" },
//       5: { header: "#10b981", bg: "#f0fdf4" },
//       6: { header: "#64748b", bg: "#f8fafc" },
//       0: { header: "#ef4444", bg: "#fef2f2" },
//     };
//     return themes[dayIndex];
//   };

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear)
//       return alert(`Restricted to ${currentYear} logs.`);
//     setCurrentMonday(newMonday);
//   };

//   const handleDateJump = (e) => {
//     const selectedValue = e.target.value;
//     if (!selectedValue) return;
//     const selectedDate = new Date(selectedValue);
//     if (selectedDate.getFullYear() !== currentYear) {
//       return alert(`Please select a date within ${currentYear}.`);
//     }
//     setCurrentMonday(getMonday(selectedDate));
//   };

//   const openCalendar = () => {
//     if (dateInputRef.current) {
//       dateInputRef.current.showPicker
//         ? dateInputRef.current.showPicker()
//         : dateInputRef.current.click();
//     }
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     try {
//       const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       await setDoc(
//         weekRef,
//         {
//           weekId: currentWeekId,
//           userId: user.uid,
//           days: finalSubmission,
//           location: USER_LOCATION,
//           submittedAt: new Date(),
//         },
//         { merge: true },
//       );
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Compliance data synced.");
//     } catch (e) {
//       console.error(e);
//     }
//     setLoading(false);
//   };

//   const futureWeek = () => {
//     selectedWeek.forEach((d) => {
//       setFuture(d.date > formatDate(today) ? true : false);
//     });
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div
//       className="container-fluid py-4 px-3 px-md-5"
//       style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
//     >
//       <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
//         <div
//           className="card border-0 shadow-sm rounded-4 p-3"
//           style={{
//             background: "rgba(255, 255, 255, 0.9)",
//             backdropFilter: "blur(12px)",
//           }}
//         >
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//             {/* 🔹 Improved Calendar Picker UI */}
//             <div className="d-flex align-items-center gap-3">
//               <div
//                 className="calendar-trigger-box d-flex align-items-center gap-2 p-2 rounded-3 border bg-white shadow-sm"
//                 onClick={openCalendar}
//                 title="Click to jump to a specific date"
//               >
//                 <div className="bg-primary text-white p-2 rounded-2 d-flex align-items-center justify-content-center">
//                   <FaCalendarAlt size={16} />
//                 </div>
//                 <div>
//                   <h5
//                     className="fw-bold mb-0 text-dark"
//                     style={{ letterSpacing: "-0.5px", fontSize: "1.1rem" }}
//                   >
//                     {currentMonthDisplay}
//                   </h5>
//                   <div
//                     className="text-muted d-flex align-items-center gap-1"
//                     style={{ fontSize: "10px", fontWeight: "bold" }}
//                   >
//                     {/* <FaMousePointer size={8} /> CLICK TO JUMP */}
//                   </div>
//                 </div>
//                 <input
//                   type="date"
//                   ref={dateInputRef}
//                   className="position-absolute"
//                   style={{ visibility: "hidden", width: 0, height: 0 }}
//                   onChange={handleDateJump}
//                   min={`${currentYear}-01-01`}
//                   max={`${currentYear}-12-31`}
//                 />
//               </div>

//               <div className="d-none d-lg-flex flex-column">
//                 <span
//                   className="badge bg-light text-secondary border px-3 rounded-pill mb-1"
//                   style={{ fontSize: "10px" }}
//                 >
//                   {currentWeekId}
//                 </span>
//                 <span
//                   className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 rounded-pill"
//                   style={{ fontSize: "10px" }}
//                 >
//                   {USER_LOCATION}
//                 </span>
//               </div>
//             </div>

//             {/* 🔹 Navigation & Actions */}
//             <div className="d-flex align-items-center gap-3">
//               <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
//                 <button
//                   onClick={() => changeWeek(-7)}
//                   className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"
//                 >
//                   <FaChevronLeft size={10} />
//                 </button>
//                 <button
//                   onClick={() => setCurrentMonday(getMonday(today))}
//                   className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold text-uppercase"
//                   style={{ fontSize: "10px", letterSpacing: "1px" }}
//                 >
//                   Today
//                 </button>
//                 <button
//                   onClick={() => changeWeek(7)}
//                   className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"
//                 >
//                   <FaChevronRight size={10} />
//                 </button>
//               </div>

//               {isLocked ? (
//                 <button
//                   onClick={() => setIsLocked(false)}
//                   className="btn btn-sm btn-dark rounded-pill px-4 py-2 shadow-sm border-0"
//                 >
//                   Edit
//                 </button>
//               ) : (
//                 <button
//                   onClick={submitWeek}
//                   disabled={loading}
//                   className="btn btn-sm btn-primary rounded-pill px-4 py-2 shadow-sm border-0"
//                   style={{ backgroundColor: "#4f46e5" }}
//                 >
//                   {loading ? "..." : "Submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-7">
//         {selectedWeek.map((d, i) => {
//           const isToday = d.date === formatDate(today);
//           const isFuture = d.date > formatDate(today);
//           const holiday = holidays.find((h) => h.date === d.date);
//           const status = weekData[d.date];
//           const theme = getDayTheme(d.day, isToday);

//           return (
//             <div key={i} className="col">
//               <div
//                 className={`card h-100 border-0 shadow-sm text-center position-relative overflow-hidden card-transition ${isFuture ? "future-card" : ""}`}
//                 style={{
//                   borderRadius: "24px",
//                   backgroundColor: isFuture ? "#f1f5f9" : "#ffffff",
//                   border: isToday
//                     ? "2px solid #4f46e5"
//                     : "1px solid rgba(0,0,0,0.04)",
//                   minHeight: "280px",
//                 }}
//               >
//                 <div
//                   className="py-2 small fw-bold text-uppercase"
//                   style={{
//                     backgroundColor: isFuture ? "#e2e8f0" : theme.header,
//                     color: "#fff",
//                     fontSize: "10px",
//                     letterSpacing: "1.5px",
//                   }}
//                 >
//                   {new Date(d.date).toLocaleDateString("en-US", {
//                     weekday: "short",
//                   })}
//                 </div>

//                 <div className="p-4 d-flex flex-column h-100">
//                   <h2
//                     className="fw-bold mb-0 text-dark"
//                     style={{ letterSpacing: "-1px" }}
//                   >
//                     {new Date(d.date).getDate()}
//                   </h2>
//                   <div className="text-muted small mb-4 fw-medium text-uppercase">
//                     {new Date(d.date).toLocaleDateString("en-US", {
//                       month: "short",
//                     })}
//                   </div>

//                   <div className="mt-auto">
//                     {holiday && (
//                       <div
//                         className="text-warning fw-bold mb-3"
//                         style={{ fontSize: "9px" }}
//                       >
//                         ● {holiday.name}
//                       </div>
//                     )}
//                     {isFuture ? (
//                       <div className="text-muted py-3">
//                         <FaLock className="opacity-25 mb-2" size={14} />
//                         <div
//                           style={{
//                             fontSize: "9px",
//                             fontWeight: "700",
//                             letterSpacing: "1px",
//                           }}
//                         >
//                           LOCKED
//                         </div>
//                       </div>
//                     ) : isLocked || d.day === 0 || d.day === 6 || holiday ? (
//                       <div
//                         className={`py-2 px-3 rounded-pill fw-bold border text-truncate ${status === "In-Office" ? "bg-success-subtle text-success border-success" : "bg-light text-muted"}`}
//                         style={{ fontSize: "10px" }}
//                       >
//                         {status ||
//                           (d.day === 0 || d.day === 6
//                             ? "WEEKEND"
//                             : holiday
//                               ? "HOLIDAY"
//                               : "PENDING")}
//                       </div>
//                     ) : (
//                       <div className="d-flex flex-column gap-2">
//                         {statusOptions.map((opt) => (
//                           <button
//                             key={opt}
//                             className={`btn btn-sm py-2 px-0 rounded-pill border-0 fw-bold transition-all ${status === opt ? "bg-primary text-white shadow" : "bg-light text-dark"}`}
//                             style={{ fontSize: "10px" }}
//                             onClick={() =>
//                               setWeekData({ ...weekData, [d.date]: opt })
//                             }
//                           >
//                             {status === opt && (
//                               <FaCheck size={8} className="me-1" />
//                             )}{" "}
//                             {opt}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <style>{`
//         .calendar-trigger-box {
//           cursor: pointer;
//           transition: all 0.2s ease-in-out;
//         }
//         .calendar-trigger-box:hover {
//           background-color: #f1f5f9 !important;
//           border-color: #4f46e5 !important;
//           transform: translateY(-2px);
//         }
//         .card-transition { transition: all 0.3s ease; }
//         .future-card { opacity: 0.6; filter: grayscale(0.2); }
//         .bg-success-subtle { background-color: #f0fdf4; color: #16a34a; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import holidaysData from "./holidays.json";
// import { db } from "../firebase";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import {
//   FaLock,
//   FaChevronLeft,
//   FaChevronRight,
//   FaCheck,
//   FaCalendarAlt,
// } from "react-icons/fa";

// export default function CalendarView({ user }) {
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const USER_LOCATION = "Pune";

//   const dateInputRef = useRef(null);

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getMonday = (d) => {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     const monday = new Date(date.setDate(diff));
//     monday.setHours(0, 0, 0, 0);
//     return monday;
//   };

//   const [currentMonday, setCurrentMonday] = useState(getMonday(today));
//   const [selectedWeek, setSelectedWeek] = useState([]);
//   const [weekData, setWeekData] = useState({});
//   const [isLocked, setIsLocked] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [holidays, setHolidays] = useState([]);

//   // Logic: Disable if the week's Monday is after the current week's Monday
//   const isFutureWeek = currentMonday > getMonday(new Date());

//   const getDayTheme = (dayIndex, isToday) => {
//     if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" };
//     const themes = {
//       1: { header: "#3b82f6", bg: "#eff6ff" },
//       2: { header: "#8b5cf6", bg: "#f5f3ff" },
//       3: { header: "#d946ef", bg: "#fdf4ff" },
//       4: { header: "#f59e0b", bg: "#fffbeb" },
//       5: { header: "#10b981", bg: "#f0fdf4" },
//       6: { header: "#64748b", bg: "#f8fafc" },
//       0: { header: "#ef4444", bg: "#fef2f2" },
//     };
//     return themes[dayIndex] || themes[1];
//   };

//   function getWeekNumber(d) {
//     const date = new Date(d);
//     date.setHours(0, 0, 0, 0);
//     date.setDate(date.getDate() + 4 - (date.getDay() || 7));
//     const yearStart = new Date(date.getFullYear(), 0, 1);
//     return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
//   }

//   const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
//   const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setWeekData(docSnap.data().days || {});
//         setIsLocked(true);
//       } else {
//         setWeekData({});
//         setIsLocked(false);
//       }
//       setLoading(false);
//     };
//     fetchData();

//     const days = Array.from({ length: 7 }).map((_, i) => {
//       const temp = new Date(currentMonday);
//       temp.setDate(currentMonday.getDate() + i);
//       return { date: formatDate(temp), day: temp.getDay() };
//     });
//     setSelectedWeek(days);
//   }, [currentMonday, user, currentWeekId]);

//   useEffect(() => {
//     setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
//   }, []);

//   const changeWeek = (offset) => {
//     const newMonday = new Date(currentMonday);
//     newMonday.setDate(currentMonday.getDate() + offset);
//     if (newMonday.getFullYear() !== currentYear) return alert(`Restricted to ${currentYear} logs.`);
//     setCurrentMonday(newMonday);
//   };

//   const handleDateJump = (e) => {
//     const selectedValue = e.target.value;
//     if (!selectedValue) return;
//     const selectedDate = new Date(selectedValue);
//     if (selectedDate.getFullYear() !== currentYear) return alert(`Please select a date within ${currentYear}.`);
//     setCurrentMonday(getMonday(selectedDate));
//   };

//   const openCalendar = () => {
//     if (dateInputRef.current) {
//       dateInputRef.current.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current.click();
//     }
//   };

//   const submitWeek = async () => {
//     setLoading(true);
//     const finalSubmission = { ...weekData };
//     selectedWeek.forEach((d) => {
//       const isWeekend = d.day === 6 || d.day === 0;
//       const holiday = holidays.find((h) => h.date === d.date);
//       if (isWeekend) finalSubmission[d.date] = "Weekend";
//       else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
//     });

//     try {
//       const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
//       await setDoc(weekRef, {
//         weekId: currentWeekId, userId: user.uid, days: finalSubmission,
//         location: USER_LOCATION, submittedAt: new Date(),
//       }, { merge: true });
//       setWeekData(finalSubmission);
//       setIsLocked(true);
//       alert("Compliance data synced.");
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const statusOptions = ["In-Office", "Remote", "Leave"];

//   return (
//     <div className="container-fluid py-4 px-3 px-md-5" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
//       {/* HEADER SECTION */}
//       <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
//         <div className="card border-0 shadow-sm rounded-4 p-3" style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)" }}>
//           <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//             <div className="d-flex align-items-center gap-3">
//               <div className="calendar-trigger-box d-flex align-items-center gap-2 p-2 rounded-3 border bg-white shadow-sm" onClick={openCalendar} style={{ cursor: "pointer" }}>
//                 <div className="bg-primary text-white p-2 rounded-2 d-flex align-items-center justify-content-center">
//                   <FaCalendarAlt size={16} />
//                 </div>
//                 <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.1rem" }}>{currentMonthDisplay}</h5>
//                 <input type="date" ref={dateInputRef} className="position-absolute" style={{ visibility: "hidden", width: 0 }} onChange={handleDateJump} min={`${currentYear}-01-01`} max={`${currentYear}-12-31`} />
//               </div>
//             </div>

//             <div className="d-flex align-items-center gap-3">
//               <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
//                 <button onClick={() => changeWeek(-7)} className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"><FaChevronLeft size={10}/></button>
//                 <button onClick={() => setCurrentMonday(getMonday(new Date()))} className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold" style={{fontSize: '10px'}}>Today</button>
//                 <button onClick={() => changeWeek(7)} className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"><FaChevronRight size={10}/></button>
//               </div>

//               {isLocked ? (
//                 <button onClick={() => setIsLocked(false)} disabled={isFutureWeek} className="btn btn-sm btn-dark rounded-pill px-4 py-2 border-0" style={{ opacity: isFutureWeek ? 0.5 : 1 }}>
//                   {isFutureWeek ? "Locked" : "Edit"}
//                 </button>
//               ) : (
//                 <button onClick={submitWeek} disabled={loading || isFutureWeek} className="btn btn-sm btn-primary rounded-pill px-4 py-2 border-0" style={{ backgroundColor: isFutureWeek ? "#94a3b8" : "#4f46e5" }}>
//                   {loading ? "..." : isFutureWeek ? "Restricted" : "Submit"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CALENDAR GRID - RESTORED FUNCTIONALITY */}
//       <div className="row row-cols-1 row-cols-md-4 row-cols-lg-7 g-3">
//         {selectedWeek.map((day) => {
//           const isToday = day.date === formatDate(today);
//           const theme = getDayTheme(day.day, isToday);
//           const holiday = holidays.find((h) => h.date === day.date);
//           const isWeekend = day.day === 6 || day.day === 0;
//           const status = weekData[day.date];

//           return (
//             <div key={day.date} className="col">
//               <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: theme.bg }}>
//                 <div className="p-2 text-center text-white fw-bold" style={{ backgroundColor: theme.header, fontSize: "0.8rem" }}>
//                   {new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}
//                 </div>
//                 <div className="p-3 text-center">
//                   <div className="h4 fw-bold mb-1">{new Date(day.date).getDate()}</div>
//                   {holiday ? (
//                     <span className="badge bg-danger-subtle text-danger rounded-pill" style={{ fontSize: "0.7rem" }}>{holiday.name}</span>
//                   ) : isWeekend ? (
//                     <span className="badge bg-secondary-subtle text-secondary rounded-pill" style={{ fontSize: "0.7rem" }}>Weekend</span>
//                   ) : (
//                     <select
//                       className="form-select form-select-sm rounded-3 border-0 shadow-sm"
//                       value={status || ""}
//                       disabled={isLocked || isFutureWeek}
//                       onChange={(e) => setWeekData({ ...weekData, [day.date]: e.target.value })}
//                     >
//                       <option value="">Select</option>
//                       {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
//                     </select>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import holidaysData from "./holidays.json";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  FaLock,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaCalendarAlt,
} from "react-icons/fa";

export default function CalendarView({ user }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const USER_LOCATION = "Pune";

  const dateInputRef = useRef(null);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [currentMonday, setCurrentMonday] = useState(getMonday(today));
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [weekData, setWeekData] = useState({});
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  // Logic: Disable if the week's Monday is after the current week's Monday
  const isFutureWeek = currentMonday > getMonday(new Date());

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3000);
  };

  const getDayTheme = (dayIndex, isToday) => {
    if (isToday) return { header: "#4f46e5", bg: "#f5f3ff" };
    const themes = {
      1: { header: "#3b82f6", bg: "#eff6ff" },
      2: { header: "#8b5cf6", bg: "#f5f3ff" },
      3: { header: "#d946ef", bg: "#fdf4ff" },
      4: { header: "#f59e0b", bg: "#fffbeb" },
      5: { header: "#10b981", bg: "#f0fdf4" },
      6: { header: "#64748b", bg: "#f8fafc" },
      0: { header: "#ef4444", bg: "#fef2f2" },
    };
    return themes[dayIndex] || themes[1];
  };

  function getWeekNumber(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  }

  const currentWeekId = `Week-${getWeekNumber(currentMonday)}-${currentMonday.getFullYear()}`;
  const currentMonthDisplay = currentMonday.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      setLoading(true);
      const docRef = doc(db, "users", user.uid, "attendance", currentWeekId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWeekData(docSnap.data().days || {});
        setIsLocked(true);
      } else {
        setWeekData({});
        setIsLocked(false);
      }
      setLoading(false);
    };
    fetchData();

    const days = Array.from({ length: 7 }).map((_, i) => {
      const temp = new Date(currentMonday);
      temp.setDate(currentMonday.getDate() + i);
      return { date: formatDate(temp), day: temp.getDay() };
    });
    setSelectedWeek(days);
  }, [currentMonday, user, currentWeekId]);

  useEffect(() => {
    setHolidays(holidaysData.filter((h) => h.location.includes(USER_LOCATION)));
  }, []);

  const changeWeek = (offset) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + offset);
    if (newMonday.getFullYear() !== currentYear)
      return alert(`Restricted to ${currentYear} logs.`);
    setCurrentMonday(newMonday);
  };

  const handleDateJump = (e) => {
    const selectedValue = e.target.value;
    if (!selectedValue) return;
    const selectedDate = new Date(selectedValue);
    if (selectedDate.getFullYear() !== currentYear)
      return alert(`Please select a date within ${currentYear}.`);
    setCurrentMonday(getMonday(selectedDate));
  };

  const openCalendar = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker
        ? dateInputRef.current.showPicker()
        : dateInputRef.current.click();
    }
  };

  const submitWeek = async () => {
    setLoading(true);
    const finalSubmission = { ...weekData };
    selectedWeek.forEach((d) => {
      const isWeekend = d.day === 6 || d.day === 0;
      const holiday = holidays.find((h) => h.date === d.date);
      if (isWeekend) finalSubmission[d.date] = "Weekend";
      else if (holiday) finalSubmission[d.date] = `Holiday (${holiday.name})`;
    });

    try {
      const weekRef = doc(db, "users", user.uid, "attendance", currentWeekId);
      await setDoc(
        weekRef,
        {
          weekId: currentWeekId,
          userId: user.uid,
          days: finalSubmission,
          location: USER_LOCATION,
          submittedAt: new Date(),
        },
        { merge: true },
      );
      setWeekData(finalSubmission);
      setIsLocked(true);
      // alert("Compliance data synced.");
      showToast("Data synced successfully!", "success");
    } catch (e) {
      showToast("Failed to save", "failed");
      console.error(e);
    }
    setLoading(false);
  };

  const statusOptions = ["In-Office", "Remote", "Leave"];

  return (
    <div
      className="container-fluid py-4 px-3 px-md-5"
      style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      {/* STICKY HEADER */}
      <div className="sticky-top mb-4" style={{ top: "15px", zIndex: 1000 }}>
        <div
          className="card border-0 shadow-sm rounded-4 p-3"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="calendar-trigger-box d-flex align-items-center gap-2 p-2 rounded-3 border bg-white shadow-sm"
                onClick={openCalendar}
                style={{ cursor: "pointer" }}
              >
                <div className="bg-primary text-white p-2 rounded-2 d-flex align-items-center justify-content-center">
                  <FaCalendarAlt size={16} />
                </div>
                <h5
                  className="fw-bold mb-0 text-dark"
                  style={{ fontSize: "1.1rem" }}
                >
                  {currentMonthDisplay}
                </h5>
                <input
                  type="date"
                  ref={dateInputRef}
                  className="position-absolute"
                  style={{ visibility: "hidden", width: 0 }}
                  onChange={handleDateJump}
                  min={`${currentYear}-01-01`}
                  max={`${currentYear}-12-31`}
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="btn-group bg-white border rounded-pill p-1 shadow-sm">
                <button
                  onClick={() => changeWeek(-7)}
                  className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"
                >
                  <FaChevronLeft size={10} />
                </button>
                <button
                  onClick={() => setCurrentMonday(getMonday(new Date()))}
                  className="btn btn-sm btn-white border-0 rounded-pill px-3 fw-bold"
                  style={{ fontSize: "10px" }}
                >
                  Today
                </button>
                <button
                  onClick={() => changeWeek(7)}
                  className="btn btn-sm btn-light border-0 rounded-pill px-3 shadow-none"
                >
                  <FaChevronRight size={10} />
                </button>
              </div>

              {isLocked ? (
                <button
                  onClick={() => setIsLocked(false)}
                  disabled={isFutureWeek}
                  className="btn btn-sm btn-dark rounded-pill px-4 py-2 border-0"
                  style={{ opacity: isFutureWeek ? 0.5 : 1 }}
                >
                  {isFutureWeek ? "Locked" : "Edit"}
                </button>
              ) : (
                <button
                  onClick={submitWeek}
                  disabled={loading || isFutureWeek}
                  className="btn btn-sm btn-primary rounded-pill px-4 py-2 border-0"
                  style={{
                    backgroundColor: isFutureWeek ? "#94a3b8" : "#4f46e5",
                  }}
                >
                  {loading ? "..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <div
          className={`alert alert-${toast.type} position-fixed center-0 start-50 translate-middle-x mt-5`}
          style={{ zIndex: 2000 }}
        >
          {toast.msg}
        </div>
      )}

      {/* CALENDAR GRID */}
      <div className="row g-3">
        {selectedWeek.map((day) => {
          const isToday = day.date === formatDate(today);
          const theme = getDayTheme(day.day, isToday);
          const holiday = holidays.find((h) => h.date === day.date);
          const isWeekend = day.day === 6 || day.day === 0;
          const currentStatus = weekData[day.date];

          return (
            <div key={day.date} className="col-12 col-md-4 col-lg-3">
              <div
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                style={{ backgroundColor: theme.bg }}
              >
                <div
                  className="p-2 text-center text-white fw-bold"
                  style={{ backgroundColor: theme.header }}
                >
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </div>
                <div className="p-3">
                  <div className="text-center mb-3">
                    <div className="h3 fw-bold mb-0">
                      {new Date(day.date).getDate()}
                    </div>
                    {/* <div className="text-muted small">{day.date}</div> */}
                  </div>

                  {holiday ? (
                    <div className="alert alert-danger py-1 px-2 text-center mb-0 small">
                      {holiday.name}
                    </div>
                  ) : isWeekend ? (
                    <div className="alert alert-secondary py-1 px-2 text-center mb-0 small">
                      Weekend
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt}
                          disabled={isLocked || isFutureWeek}
                          onClick={() =>
                            setWeekData({ ...weekData, [day.date]: opt })
                          }
                          className={`btn btn-sm rounded-pill border-0 transition-all ${
                            currentStatus === opt
                              ? "btn-primary shadow-sm"
                              : "btn-light text-muted"
                          }`}
                          style={{
                            fontSize: "11px",
                            opacity: isLocked || isFutureWeek ? 0.7 : 1,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
