// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";

// const HOLIDAYS_2026 = [
//   "2026-01-26",
//   "2026-02-19",
//   "2026-03-03",
//   "2026-03-19",
//   "2026-03-26",
//   "2026-03-31",
//   "2026-04-03",
//   "2026-04-14",
//   "2026-05-01",
//   "2026-05-28",
//   "2026-06-26",
//   "2026-08-26",
//   "2026-09-14",
//   "2026-10-02",
//   "2026-10-20",
//   "2026-11-10",
//   "2026-11-11",
//   "2026-11-24",
//   "2026-12-25",
// ];

// export default function Reports({ user }) {
//   const [reports, setReports] = useState([]);
//   const [totalAvg, setTotalAvg] = useState(0);
//   const [stats, setStats] = useState({ green: 0, total: 0 }); // 🔹 Track counts
//   const [loading, setLoading] = useState(true);

//   const formatKey = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };

//   const getTimeline = () => {
//     const weeks = [];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let d = new Date(today.getFullYear(), 0, 1);
//     const dayOfWeek = d.getDay();
//     const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//     d.setDate(d.getDate() - diffToMonday);

//     while (d <= today) {
//       const temp = new Date(d);
//       temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7));
//       const weekNo = Math.ceil(
//         ((temp - new Date(temp.getFullYear(), 0, 1)) / 86400000 + 1) / 7,
//       );
//       const weekId = `Week-${weekNo}-${temp.getFullYear()}`;

//       const weekDays = [];
//       for (let i = 0; i < 5; i++) {
//         const dayDate = new Date(d.getTime());
//         dayDate.setDate(dayDate.getDate() + i);
//         weekDays.push(formatKey(dayDate));
//       }
//       weeks.push({ id: weekId, days: weekDays });
//       d.setDate(d.getDate() + 7);
//     }
//     return weeks.reverse();
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       try {
//         const attendanceRef = collection(db, "users", user.uid, "attendance");
//         const snap = await getDocs(attendanceRef);
//         const firebaseData = {};
//         snap.forEach((doc) => {
//           firebaseData[doc.id] = doc.data().days || {};
//         });

//         const timeline = getTimeline();
//         let globalOfficeCount = 0;

//         const fullReports = timeline.map((week) => {
//           const loggedData = firebaseData[week.id] || {};
//           const officeCount = week.days.filter(
//             (dateStr) => loggedData[dateStr] === "In-Office",
//           ).length;
//           globalOfficeCount += officeCount;

//           return {
//             weekId: week.id,
//             days: week.days,
//             data: loggedData,
//             percentage: ((officeCount / 5) * 100).toFixed(0),
//             officeCount,
//           };
//         });

//         const totalPossibleDays = fullReports.length * 5;
//         const avg =
//           totalPossibleDays > 0
//             ? ((globalOfficeCount / totalPossibleDays) * 100).toFixed(0)
//             : 0;

//         setStats({ green: globalOfficeCount, total: totalPossibleDays }); // 🔹 Set counts
//         setTotalAvg(avg);
//         setReports(fullReports);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, [user?.uid]);

//   if (loading)
//     return (
//       <div className="p-5 text-center text-muted small fw-bold">
//         ANALYSING LOGS...
//       </div>
//     );

//   return (
//     <div
//       className="container py-4 px-2 mb-5 pb-5"
//       style={{ maxWidth: "600px" }}
//     >
//       {/* 🔹 Global Average Summary Card with Total Days */}
//       <div
//         className="card border-0 bgs text-white p-4 mb-4 shadow-sm"
//         style={{ borderRadius: "24px" }}
//       >
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <small
//               className="fw-bold opacity-75 text-uppercase"
//               style={{ fontSize: "11px", letterSpacing: "1px" }}
//             >
//               Overall Attendance
//             </small>
//             <div className="d-flex align-items-baseline gap-2">
//               <h1 className="display-4 fw-bold mb-0">{totalAvg}%</h1>
//               <span className="fw-bold opacity-75">In-Office</span>
//             </div>
//           </div>
//           <div className="text-end border-start ps-3 border-white border-opacity-25">
//             <small
//               className="fw-bold opacity-75 text-uppercase d-block"
//               style={{ fontSize: "10px" }}
//             >
//               Total Days
//             </small>
//             <h3 className="fw-bold mb-0">
//               {stats.green} / {stats.total}
//             </h3>
//           </div>
//         </div>
//       </div>

//       <h6 className="fw-bold mb-3 text-white opacity-30 px-1">
//         Weekly Mon-Fri Activity
//       </h6>

//       <div className="d-flex flex-column gap-3">
//         {reports.map((report) => (
//           <div
//             key={report.weekId}
//             className="card border-0 shadow-sm p-3 bg-white"
//             style={{ borderRadius: "18px" }}
//           >
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <small
//                   className="text-muted fw-bold text-uppercase d-block"
//                   style={{ fontSize: "10px" }}
//                 >
//                   {report.weekId}
//                 </small>
//                 <h5 className="fw-bold mb-0 text-primary">
//                   {report.percentage}%
//                 </h5>
//               </div>
//               <div className="text-end">
//                 <span
//                   className="fw-bold small d-block opacity-50"
//                   style={{ fontSize: "10px" }}
//                 >
//                   Office Days
//                 </span>
//                 <h6 className="fw-bold mb-0 text-dark">
//                   {report.officeCount} / 5
//                 </h6>
//               </div>
//             </div>

//             <div className="d-flex justify-content-between gap-1 mt-2">
//               {report.days.map((dateStr) => {
//                 const status = report.data[dateStr];
//                 const dayLetter = new Date(
//                   dateStr + "T00:00:00",
//                 ).toLocaleDateString("en-US", { weekday: "narrow" });
//                 const pillColor =
//                   status === "In-Office" ? "bg-success" : "bg-danger";

//                 return (
//                   <div key={dateStr} className="flex-fill text-center">
//                     <div
//                       className={`status-pill mb-1 ${pillColor}`}
//                       style={{ height: "8px", borderRadius: "4px" }}
//                     ></div>
//                     <small
//                       className="fw-bold text-muted"
//                       style={{ fontSize: "9px" }}
//                     >
//                       {dayLetter}
//                     </small>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       <style>{`
//         .bg-primary { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important; }
//         .bg-success { background-color: #198754 !important; }
//         .bg-danger { background-color: #dc3545 !important; }
//         .status-pill { width: 100%; transition: all 0.3s ease; }
//         .bgs{ background: linear-gradient(260deg, #9da5b3 0%, #ca0a74 100%) !important;}
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const HOLIDAYS_2026 = [
//   "2026-01-26", "2026-02-19", "2026-03-03", "2026-03-19", "2026-03-26",
//   "2026-03-31", "2026-04-03", "2026-04-14", "2026-05-01", "2026-05-28",
//   "2026-06-26", "2026-08-26", "2026-09-14", "2026-10-02", "2026-10-20",
//   "2026-11-10", "2026-11-11", "2026-11-24", "2026-12-25",
// ];

// export default function Reports({ user }) {
//   const [reports, setReports] = useState([]);
//   const [totalAvg, setTotalAvg] = useState(0);
//   const [stats, setStats] = useState({ green: 0, total: 0 });
//   const [loading, setLoading] = useState(true);

//   // 🔹 Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 4;

//   const formatKey = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };

//   const getTimeline = () => {
//     const weeks = [];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let d = new Date(today.getFullYear(), 0, 1);
//     const dayOfWeek = d.getDay();
//     const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//     d.setDate(d.getDate() - diffToMonday);

//     while (d <= today) {
//       const temp = new Date(d);
//       temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7));
//       const weekNo = Math.ceil(
//         ((temp - new Date(temp.getFullYear(), 0, 1)) / 86400000 + 1) / 7,
//       );
//       const weekId = `Week-${weekNo}-${temp.getFullYear()}`;

//       const weekDays = [];
//       for (let i = 0; i < 5; i++) {
//         const dayDate = new Date(d.getTime());
//         dayDate.setDate(dayDate.getDate() + i);
//         weekDays.push(formatKey(dayDate));
//       }
//       weeks.push({ id: weekId, days: weekDays });
//       d.setDate(d.getDate() + 7);
//     }
//     return weeks.reverse();
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       try {
//         const attendanceRef = collection(db, "users", user.uid, "attendance");
//         const snap = await getDocs(attendanceRef);
//         const firebaseData = {};
//         snap.forEach((doc) => {
//           firebaseData[doc.id] = doc.data().days || {};
//         });

//         const timeline = getTimeline();
//         let globalOfficeCount = 0;

//         const fullReports = timeline.map((week) => {
//           const loggedData = firebaseData[week.id] || {};
//           const officeCount = week.days.filter(
//             (dateStr) => loggedData[dateStr] === "In-Office",
//           ).length;
//           globalOfficeCount += officeCount;

//           return {
//             weekId: week.id,
//             days: week.days,
//             data: loggedData,
//             percentage: ((officeCount / 5) * 100).toFixed(0),
//             officeCount,
//           };
//         });

//         const totalPossibleDays = fullReports.length * 5;
//         const avg = totalPossibleDays > 0 ? ((globalOfficeCount / totalPossibleDays) * 100).toFixed(0) : 0;

//         setStats({ green: globalOfficeCount, total: totalPossibleDays });
//         setTotalAvg(avg);
//         setReports(fullReports);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, [user?.uid]);

//   // 🔹 Pagination Logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(reports.length / itemsPerPage);

//   if (loading)
//     return <div className="p-5 text-center text-muted small fw-bold">ANALYSING LOGS...</div>;

//   return (
//     <div className="container py-4 px-2 mb-5 pb-5" style={{ maxWidth: "600px" }}>
//       {/* Summary Card */}
//       <div className="card border-0 bgs text-white p-4 mb-4 shadow-sm" style={{ borderRadius: "24px" }}>
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <small className="fw-bold opacity-75 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
//               Overall Attendance
//             </small>
//             <div className="d-flex align-items-baseline gap-2">
//               <h1 className="display-4 fw-bold mb-0">{totalAvg}%</h1>
//               <span className="fw-bold opacity-75">In-Office</span>
//             </div>
//           </div>
//           <div className="text-end border-start ps-3 border-white border-opacity-25">
//             <small className="fw-bold opacity-75 text-uppercase d-block" style={{ fontSize: "10px" }}>
//               Total Days
//             </small>
//             <h3 className="fw-bold mb-0">{stats.green} / {stats.total}</h3>
//           </div>
//         </div>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mb-3 px-1">
//         <h6 className="fw-bold text-white opacity-30 mb-0">Weekly Mon-Fri Activity</h6>
//         <div className="d-flex gap-2" style={{ fontSize: '9px' }}>
//           <span className="text-white-50"><span className="dot bg-warning"></span> Holiday</span>
//           <span className="text-white-50"><span className="dot bg-danger"></span> Remote</span>
//         </div>
//       </div>

//       <div className="d-flex flex-column gap-3">
//         {currentReports.map((report) => (
//           <div key={report.weekId} className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: "18px" }}>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: "10px" }}>{report.weekId}</small>
//                 <h5 className="fw-bold mb-0 text-primary">{report.percentage}%</h5>
//               </div>
//               <div className="text-end">
//                 <span className="fw-bold small d-block opacity-50" style={{ fontSize: "10px" }}>Office Days</span>
//                 <h6 className="fw-bold mb-0 text-dark">{report.officeCount} / 5</h6>
//               </div>
//             </div>

//             <div className="d-flex justify-content-between gap-1 mt-2">
//               {report.days.map((dateStr) => {
//                 const status = report.data[dateStr];
//                 const isHoliday = HOLIDAYS_2026.includes(dateStr);
//                 const dayLetter = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "narrow" });

//                 let pillColor = "bg-light"; // Default
//                 if (isHoliday) pillColor = "bg-warning";
//                 else if (status === "In-Office") pillColor = "bg-success";
//                 else if (status === "Remote") pillColor = "bg-danger";
//                 else pillColor = "bg-light";

//                 return (
//                   <div key={dateStr} className="flex-fill text-center">
//                     <div className={`status-pill mb-1 ${pillColor}`} style={{ height: "8px", borderRadius: "4px" }}></div>
//                     <small className="fw-bold text-muted" style={{ fontSize: "9px" }}>{dayLetter}</small>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔹 PAGINATION CONTROLS */}
//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center align-items-center gap-4 mt-5">
//           <button
//             className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow"
//             style={{ width: '40px', height: '40px', border: 'none' }}
//             onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0,0); }}
//             disabled={currentPage === 1}
//           >
//             <FaChevronLeft size={14} />
//           </button>

//           <div className="text-center">
//             <span className="fw-bold text-white h6 mb-0">{currentPage} / {totalPages}</span>
//             <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '8px' }}>Page</div>
//           </div>

//           <button
//             className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow"
//             style={{ width: '40px', height: '40px', border: 'none' }}
//             onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo(0,0); }}
//             disabled={currentPage === totalPages}
//           >
//             <FaChevronRight size={14} />
//           </button>
//         </div>
//       )}

//       <style>{`
//         .bg-primary { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important; }
//         .bg-success { background-color: #198754 !important; }
//         .bg-danger { background-color: #dc3545 !important; }
//         .bg-warning { background-color: #ffc107 !important; }
//         .bg-light { background-color: #e9ecef !important; }
//         .status-pill { width: 100%; transition: all 0.3s ease; }
//         .bgs { background: linear-gradient(260deg, #9da5b3 0%, #ca0a74 100%) !important; }
//         .dot { height: 6px; width: 6px; border-radius: 50%; display: inline-block; margin-right: 2px; }
//         .btn-primary:disabled { background: #6c757d !important; opacity: 0.5; cursor: not-allowed; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const HOLIDAYS_2026 = [
//   "2026-01-26", "2026-02-19", "2026-03-03", "2026-03-19", "2026-03-26",
//   "2026-03-31", "2026-04-03", "2026-04-14", "2026-05-01", "2026-05-28",
//   "2026-06-26", "2026-08-26", "2026-09-14", "2026-10-02", "2026-10-20",
//   "2026-11-10", "2026-11-11", "2026-11-24", "2026-12-25",
// ];

// export default function Reports({ user }) {
//   const [reports, setReports] = useState([]);
//   const [totalAvg, setTotalAvg] = useState(0);
//   const [stats, setStats] = useState({ green: 0, total: 0 });
//   const [loading, setLoading] = useState(true);

//   // 🔹 Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 4;

//   const formatKey = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };

//   const getTimeline = () => {
//     const weeks = [];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let d = new Date(today.getFullYear(), 0, 1);
//     const dayOfWeek = d.getDay();
//     const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//     d.setDate(d.getDate() - diffToMonday);

//     while (d <= today) {
//       const temp = new Date(d);
//       temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7));
//       const weekNo = Math.ceil(
//         ((temp - new Date(temp.getFullYear(), 0, 1)) / 86400000 + 1) / 7,
//       );
//       const weekId = `Week-${weekNo}-${temp.getFullYear()}`;

//       const weekDays = [];
//       for (let i = 0; i < 5; i++) {
//         const dayDate = new Date(d.getTime());
//         dayDate.setDate(dayDate.getDate() + i);
//         weekDays.push(formatKey(dayDate));
//       }
//       weeks.push({ id: weekId, days: weekDays });
//       d.setDate(d.getDate() + 7);
//     }
//     return weeks.reverse();
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       try {
//         const attendanceRef = collection(db, "users", user.uid, "attendance");
//         const snap = await getDocs(attendanceRef);
//         const firebaseData = {};
//         snap.forEach((doc) => {
//           firebaseData[doc.id] = doc.data().days || {};
//         });

//         const timeline = getTimeline();
//         let globalOfficeCount = 0;

//         const fullReports = timeline.map((week) => {
//           const loggedData = firebaseData[week.id] || {};
//           const officeCount = week.days.filter(
//             (dateStr) => loggedData[dateStr] === "In-Office",
//           ).length;
//           globalOfficeCount += officeCount;

//           return {
//             weekId: week.id,
//             days: week.days,
//             data: loggedData,
//             percentage: ((officeCount / 5) * 100).toFixed(0),
//             officeCount,
//           };
//         });

//         const totalPossibleDays = fullReports.length * 5;
//         const avg = totalPossibleDays > 0 ? ((globalOfficeCount / totalPossibleDays) * 100).toFixed(0) : 0;

//         setStats({ green: globalOfficeCount, total: totalPossibleDays });
//         setTotalAvg(avg);
//         setReports(fullReports);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, [user?.uid]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(reports.length / itemsPerPage);

//   if (loading)
//     return <div className="p-5 text-center text-muted small fw-bold">ANALYSING LOGS...</div>;

//   return (
//     <div className="container py-4 px-2 mb-5 pb-5" style={{ maxWidth: "600px" }}>
//       {/* Summary Card */}
//       <div className="card border-0 bgs text-white p-4 mb-4 shadow-sm" style={{ borderRadius: "24px" }}>
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <small className="fw-bold opacity-75 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>
//               Overall Attendance
//             </small>
//             <div className="d-flex align-items-baseline gap-2">
//               <h1 className="display-4 fw-bold mb-0">{totalAvg}%</h1>
//               <span className="fw-bold opacity-75">In-Office</span>
//             </div>
//           </div>
//           <div className="text-end border-start ps-3 border-white border-opacity-25">
//             <small className="fw-bold opacity-75 text-uppercase d-block" style={{ fontSize: "10px" }}>
//               Total Days
//             </small>
//             <h3 className="fw-bold mb-0">{stats.green} / {stats.total}</h3>
//           </div>
//         </div>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mb-3 px-1">
//         <h6 className="fw-bold text-white opacity-30 mb-0">Weekly Mon-Fri Activity</h6>
//         <div className="d-flex gap-2" style={{ fontSize: '9px' }}>
//           <span className="text-white-50"><span className="dot bg-warning"></span> Holiday</span>
//           <span className="text-white-50"><span className="dot bg-danger"></span> Remote</span>
//         </div>
//       </div>

//       <div className="d-flex flex-column gap-3">
//         {currentReports.map((report) => (
//           <div key={report.weekId} className="card border-0 shadow-sm p-3 bg-white" style={{ borderRadius: "18px" }}>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: "10px" }}>{report.weekId}</small>
//                 <h5 className="fw-bold mb-0 text-primary">{report.percentage}%</h5>
//               </div>
//               <div className="text-end">
//                 <span className="fw-bold small d-block opacity-50" style={{ fontSize: "10px" }}>Office Days</span>
//                 <h6 className="fw-bold mb-0 text-dark">{report.officeCount} / 5</h6>
//               </div>
//             </div>

//             <div className="d-flex justify-content-between gap-1 mt-2">
//               {report.days.map((dateStr) => {
//                 const status = report.data[dateStr];
//                 const isHoliday = HOLIDAYS_2026.includes(dateStr);
//                 const dayLetter = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "narrow" });

//                 let pillColor = "";

//                 if (isHoliday) {
//                   pillColor = "bg-warning"; // Holiday takes priority
//                 } else if (status === "In-Office") {
//                   pillColor = "bg-success"; // Explicit Office entry
//                 } else {
//                   // Not in office, No entry, Not holiday -> Remote (Red)
//                   pillColor = "bg-danger";
//                 }

//                 return (
//                   <div key={dateStr} className="flex-fill text-center">
//                     <div className={`status-pill mb-1 ${pillColor}`} style={{ height: "8px", borderRadius: "4px" }}></div>
//                     <small className="fw-bold text-muted" style={{ fontSize: "9px" }}>{dayLetter}</small>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔹 PAGINATION CONTROLS */}
//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center align-items-center gap-4 mt-5">
//           <button
//             className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow"
//             style={{ width: '40px', height: '40px', border: 'none' }}
//             onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0,0); }}
//             disabled={currentPage === 1}
//           >
//             <FaChevronLeft size={14} />
//           </button>

//           <div className="text-center">
//             <span className="fw-bold text-white h6 mb-0">{currentPage} / {totalPages}</span>
//             <div className="text-muted small text-uppercase fw-bold" style={{ fontSize: '8px' }}>Page</div>
//           </div>

//           <button
//             className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow"
//             style={{ width: '40px', height: '40px', border: 'none' }}
//             onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo(0,0); }}
//             disabled={currentPage === totalPages}
//           >
//             <FaChevronRight size={14} />
//           </button>
//         </div>
//       )}

//       <style>{`
//         .bg-primary { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important; }
//         .bg-success { background-color: #198754 !important; }
//         .bg-danger { background-color: #dc3545 !important; }
//         .bg-warning { background-color: #ffc107 !important; }
//         .status-pill { width: 100%; transition: all 0.3s ease; }
//         .bgs { background: linear-gradient(260deg, #9da5b3 0%, #ca0a74 100%) !important; }
//         .dot { height: 6px; width: 6px; border-radius: 50%; display: inline-block; margin-right: 2px; }
//         .btn-primary:disabled { opacity: 0.3; }
//       `}</style>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { FaChevronLeft, FaChevronRight, FaChartLine, FaCalendarAlt } from "react-icons/fa";

// const HOLIDAYS_2026 = [
//   "2026-01-26", "2026-02-19", "2026-03-03", "2026-03-19", "2026-03-26",
//   "2026-03-31", "2026-04-03", "2026-04-14", "2026-05-01", "2026-05-28",
//   "2026-06-26", "2026-08-26", "2026-09-14", "2026-10-02", "2026-10-20",
//   "2026-11-10", "2026-11-11", "2026-11-24", "2026-12-25",
// ];

// export default function Reports({ user }) {
//   const [reports, setReports] = useState([]);
//   const [totalAvg, setTotalAvg] = useState(0);
//   const [stats, setStats] = useState({ green: 0, total: 0 });
//   const [loading, setLoading] = useState(true);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 4;

//   const formatKey = (date) => {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");
//     return `${y}-${m}-${d}`;
//   };

//   const getTimeline = () => {
//     const weeks = [];
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let d = new Date(today.getFullYear(), 0, 1);
//     const dayOfWeek = d.getDay();
//     const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//     d.setDate(d.getDate() - diffToMonday);

//     while (d <= today) {
//       const temp = new Date(d);
//       temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7));
//       const weekNo = Math.ceil(
//         ((temp - new Date(temp.getFullYear(), 0, 1)) / 86400000 + 1) / 7,
//       );
//       const weekId = `Week-${weekNo}-${temp.getFullYear()}`;

//       const weekDays = [];
//       for (let i = 0; i < 5; i++) {
//         const dayDate = new Date(d.getTime());
//         dayDate.setDate(dayDate.getDate() + i);
//         weekDays.push(formatKey(dayDate));
//       }
//       weeks.push({ id: weekId, days: weekDays });
//       d.setDate(d.getDate() + 7);
//     }
//     return weeks.reverse();
//   };

//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!user?.uid) return;
//       setLoading(true);
//       try {
//         const attendanceRef = collection(db, "users", user.uid, "attendance");
//         const snap = await getDocs(attendanceRef);
//         const firebaseData = {};
//         snap.forEach((doc) => {
//           firebaseData[doc.id] = doc.data().days || {};
//         });

//         const timeline = getTimeline();
//         let globalOfficeCount = 0;

//         const fullReports = timeline.map((week) => {
//           const loggedData = firebaseData[week.id] || {};
//           const officeCount = week.days.filter(
//             (dateStr) => loggedData[dateStr] === "In-Office",
//           ).length;
//           globalOfficeCount += officeCount;

//           return {
//             weekId: week.id,
//             days: week.days,
//             data: loggedData,
//             percentage: ((officeCount / 5) * 100).toFixed(0),
//             officeCount,
//           };
//         });

//         const totalPossibleDays = fullReports.length * 5;
//         const avg = totalPossibleDays > 0 ? ((globalOfficeCount / totalPossibleDays) * 100).toFixed(0) : 0;

//         setStats({ green: globalOfficeCount, total: totalPossibleDays });
//         setTotalAvg(avg);
//         setReports(fullReports);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReports();
//   }, [user?.uid]);

//   const totalPages = Math.ceil(reports.length / itemsPerPage);
//   const currentReports = reports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status"></div>
//         <span className="ms-2 fw-bold text-muted">Analyzing Logs...</span>
//       </div>
//     );

//   return (
//     <div className="container py-4 px-3" style={{ maxWidth: "550px" }}>

//       {/* 🔹 Glassmorphism Summary Card */}
//       <div className="summary-card shadow-lg p-4 mb-4 text-white position-relative overflow-hidden">
//         <div className="d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 1 }}>
//           <div>
//             <div className="d-flex align-items-center gap-2 opacity-75 mb-1">
//               <FaChartLine size={14} />
//               <small className="fw-bold text-uppercase ls-1">Annual Compliance</small>
//             </div>
//             <div className="d-flex align-items-baseline gap-2">
//               <h1 className="display-4 fw-bold mb-0">{totalAvg}%</h1>
//               <span className="fw-medium opacity-75">Presence</span>
//             </div>
//           </div>
//           <div className="text-end border-start ps-3 border-white border-opacity-25">
//              <div className="opacity-50 small fw-bold text-uppercase mb-1">Office Days</div>
//              <h3 className="fw-bold mb-0">{stats.green} <span className="fs-6 opacity-50">/ {stats.total}</span></h3>
//           </div>
//         </div>
//         <div className="card-blob"></div>
//       </div>

//       {/* 🔹 Legend & Title */}
//       <div className="d-flex justify-content-between align-items-center mb-3 px-1">
//         <div className="d-flex align-items-center gap-2">
//           <FaCalendarAlt className="text-secondary opacity-50" />
//           <h6 className="fw-bold text-dark opacity-75 mb-0" style={{ fontSize: "13px" }}>Activity Timeline</h6>
//         </div>
//         <div className="d-flex gap-3">
//           <div className="d-flex align-items-center gap-1 small-text"><span className="legend-dot bg-success"></span> Office</div>
//           <div className="d-flex align-items-center gap-1 small-text"><span className="legend-dot bg-warning"></span> Holiday</div>
//           <div className="d-flex align-items-center gap-1 small-text"><span className="legend-dot bg-danger"></span> Remote</div>
//         </div>
//       </div>

//       {/* 🔹 Reports List */}
//       <div className="d-flex flex-column gap-3 mb-4">
//         {currentReports.map((report) => (
//           <div key={report.weekId} className="report-card border-0 shadow-sm p-3 bg-white rounded-4 transition-hover">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 <span className="badge bg-light text-secondary rounded-pill mb-1" style={{ fontSize: "9px" }}>{report.weekId}</span>
//                 <h5 className="fw-bold mb-0 text-dark">{report.percentage}% <small className="text-muted fw-normal" style={{ fontSize: "12px" }}>Weekly</small></h5>
//               </div>
//               <div className="text-end">
//                 <h6 className="fw-bold mb-0 text-primary">{report.officeCount} <span className="text-muted opacity-50 fs-6">/ 5</span></h6>
//                 <div className="text-muted fw-bold" style={{ fontSize: "8px", letterSpacing: "0.5px" }}>DAYS LOGGED</div>
//               </div>
//             </div>

//             <div className="d-flex justify-content-between gap-2 mt-2 bg-light p-2 rounded-3">
//               {report.days.map((dateStr) => {
//                 const status = report.data[dateStr];
//                 const isHoliday = HOLIDAYS_2026.includes(dateStr);
//                 const dayLetter = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "narrow" });

//                 let pillClass = "bg-danger";
//                 if (isHoliday) pillClass = "bg-warning";
//                 else if (status === "In-Office") pillClass = "bg-success shadow-success";

//                 return (
//                   <div key={dateStr} className="flex-fill text-center">
//                     <div className={`status-pill ${pillClass}`}></div>
//                     <small className="fw-bold text-muted mt-1 d-block" style={{ fontSize: "10px" }}>{dayLetter}</small>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔹 Minimalist Pagination */}
//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center align-items-center gap-4 py-4">
//           <button
//             className="pagination-btn shadow-sm"
//             onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0,0); }}
//             disabled={currentPage === 1}
//           >
//             <FaChevronLeft size={12} />
//           </button>

//           <div className="text-center">
//             <span className="fw-bold text-dark h6 mb-0">{currentPage} <span className="opacity-25 mx-1">/</span> {totalPages}</span>
//           </div>

//           <button
//             className="pagination-btn shadow-sm"
//             onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo(0,0); }}
//             disabled={currentPage === totalPages}
//           >
//             <FaChevronRight size={12} />
//           </button>
//         </div>
//       )}

//       <style>{`
//         .ls-1 { letter-spacing: 1.5px; }
//         .small-text { font-size: 10px; font-weight: 700; color: #6c757d; text-transform: uppercase; }

//         .summary-card {
//           background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
//           border-radius: 24px;
//           border: none;
//         }
//         .card-blob {
//           position: absolute; width: 150px; height: 150px; background: rgba(255,255,255,0.1);
//           border-radius: 50%; top: -50px; right: -50px;
//         }

//         .report-card { border: 1px solid rgba(0,0,0,0.03); transition: transform 0.2s ease; }
//         .transition-hover:hover { transform: translateY(-3px); }

//         .status-pill { height: 6px; border-radius: 10px; width: 100%; }
//         .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

//         .bg-danger { background-color: #ff4d4f !important; }
//         .bg-success { background-color: #52c41a !important; }
//         .bg-warning { background-color: #faad14 !important; }
//         .shadow-success { box-shadow: 0 0 10px rgba(82, 196, 26, 0.3); }

//         .pagination-btn {
//           width: 40px; height: 40px; border-radius: 50%; border: none;
//           background: white; color: #6366f1; display: flex; align-items: center;
//           justify-content: center; transition: 0.3s;
//         }
//         .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
//         .pagination-btn:hover:not(:disabled) { background: #6366f1; color: white; }
//       `}</style>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaChevronLeft, FaChevronRight, FaChartLine, FaCalendarAlt } from "react-icons/fa";

const HOLIDAYS_2026 = [
  "2026-01-26", "2026-02-19", "2026-03-03", "2026-03-19", "2026-03-26",
  "2026-03-31", "2026-04-03", "2026-04-14", "2026-05-01", "2026-05-28",
  "2026-06-26", "2026-08-26", "2026-09-14", "2026-10-02", "2026-10-20",
  "2026-11-10", "2026-11-11", "2026-11-24", "2026-12-25",
];

export default function Reports({ user }) {
  const [reports, setReports] = useState([]);
  const [totalAvg, setTotalAvg] = useState(0);
  const [stats, setStats] = useState({ green: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const formatKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getTimeline = () => {
    const weeks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let d = new Date(today.getFullYear(), 0, 1);
    const dayOfWeek = d.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    d.setDate(d.getDate() - diffToMonday);

    while (d <= today) {
      const temp = new Date(d);
      temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7));
      const weekNo = Math.ceil(
        ((temp - new Date(temp.getFullYear(), 0, 1)) / 86400000 + 1) / 7,
      );
      const weekId = `Week-${weekNo}-${temp.getFullYear()}`;

      const weekDays = [];
      for (let i = 0; i < 5; i++) {
        const dayDate = new Date(d.getTime());
        dayDate.setDate(dayDate.getDate() + i);
        weekDays.push(formatKey(dayDate));
      }
      weeks.push({ id: weekId, days: weekDays });
      d.setDate(d.getDate() + 7);
    }
    return weeks.reverse();
  };

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const attendanceRef = collection(db, "users", user.uid, "attendance");
        const snap = await getDocs(attendanceRef);
        const firebaseData = {};
        snap.forEach((doc) => {
          firebaseData[doc.id] = doc.data().days || {};
        });

        const timeline = getTimeline();
        let globalOfficeCount = 0;

        const fullReports = timeline.map((week) => {
          const loggedData = firebaseData[week.id] || {};
          const officeCount = week.days.filter(
            (dateStr) => loggedData[dateStr] === "In-Office",
          ).length;
          globalOfficeCount += officeCount;

          return {
            weekId: week.id,
            days: week.days,
            data: loggedData,
            percentage: ((officeCount / 5) * 100).toFixed(0),
            officeCount,
          };
        });

        const totalPossibleDays = fullReports.length * 5;
        const avg = totalPossibleDays > 0 ? ((globalOfficeCount / totalPossibleDays) * 100).toFixed(0) : 0;

        setStats({ green: globalOfficeCount, total: totalPossibleDays });
        setTotalAvg(avg);
        setReports(fullReports);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user?.uid]);

  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const currentReports = reports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2 fw-bold text-muted">Analyzing Logs...</span>
      </div>
    );

  return (
    <div className="container py-3 px-2 px-md-3" style={{ maxWidth: "550px" }}>

      {/* 🔹 Summary Card */}
      <div className="summary-card shadow-lg p-4 mb-3 text-white position-relative overflow-hidden">
        <div className="d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 1 }}>
          <div>
            <div className="d-flex align-items-center gap-2 opacity-75 mb-1">
              {/* <FaChartLine size={14} /> */}
              <small className="fw-bold text-uppercase ls-1">Overall Attendance</small>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h1 className="display-4 fw-bold mb-0">{totalAvg}%</h1>
              <span className="fw-medium opacity-75 d-none d-sm-inline">Presence</span>
            </div>
          </div>
          <div className="text-end border-start ps-3 border-white border-opacity-25">
             <div className="opacity-50 small fw-bold text-uppercase mb-1">Office Days</div>
             <h3 className="fw-bold mb-0">{stats.green} <span className="fs-6 opacity-50">/ {stats.total}</span></h3>
          </div>
        </div>
        <div className="card-blob"></div>
      </div>

      {/* 🔹 TOP PAGINATION & TITLE BOX */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 bg-white p-2 rounded-4 shadow-sm">
        <div className="d-flex align-items-center gap-2 px-2">
          <FaCalendarAlt className="text-primary opacity-75" />
          <h6 className="fw-bold text-dark mb-0 small">Timeline</h6>
        </div>

        {totalPages > 1 && (
          <div className="d-flex align-items-center gap-3">
            <button
              className="pagination-btn-top shadow-sm"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={10} />
            </button>

            <span className="fw-bold text-dark small" style={{ minWidth: '45px', textAlign: 'center' }}>
              {currentPage} / {totalPages}
            </span>

            <button
              className="pagination-btn-top shadow-sm"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        )}
      </div>

      {/* 🔹 Legend */}
      <div className="d-flex justify-content-center flex-wrap gap-3 mb-3">
        <div className="d-flex align-items-center gap-1 small-text"><span className="legend-dot bg-success"></span> Office</div>
        <div className="d-flex align-items-center gap-1 small-text"><span className="legend-dot bg-warning"></span> Holiday</div>
        <div className="d-flex align-items-center gap-1 small-text"><span className="legend-dot bg-danger"></span> Remote</div>
      </div>

      {/* 🔹 Reports List (Fixed Min-Height to prevent layout jump) */}
      <div className="d-flex flex-column gap-3 mb-5" style={{ minHeight: "450px" }}>
        {currentReports.map((report) => (
          <div key={report.weekId} className="report-card border-0 shadow-sm p-3 bg-white rounded-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="badge bg-light text-secondary rounded-pill mb-1" style={{ fontSize: "9px" }}>{report.weekId}</span>
                <h5 className="fw-bold mb-0 text-dark small-mobile-title">{report.percentage}% <small className="text-muted fw-normal">Weekly</small></h5>
              </div>
              <div className="text-end">
                <h6 className="fw-bold mb-0 text-primary small">{report.officeCount} <span className="text-muted opacity-50">/ 5</span></h6>
                <div className="text-muted fw-bold" style={{ fontSize: "7px" }}>DAYS LOGGED</div>
              </div>
            </div>

            <div className="d-flex justify-content-between gap-1 gap-md-2 mt-2 bg-light p-2 rounded-3">
              {report.days.map((dateStr) => {
                const status = report.data[dateStr];
                const isHoliday = HOLIDAYS_2026.includes(dateStr);
                const dayLetter = new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "narrow" });

                let pillClass = "bg-danger";
                if (isHoliday) pillClass = "bg-warning";
                else if (status === "In-Office") pillClass = "bg-success shadow-success";

                return (
                  <div key={dateStr} className="flex-fill text-center">
                    <div className={`status-pill ${pillClass}`}></div>
                    <small className="fw-bold text-muted mt-1 d-block" style={{ fontSize: "9px" }}>{dayLetter}</small>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

<style>{`
  .ls-1 { letter-spacing: 1.5px; }
  .small-text { font-size: 9px; font-weight: 700; color: #000; text-transform: uppercase; }

  .summary-card {
    background: linear-gradient(37deg, #483f44 0%, #000 100%);
    border-radius: 20px;
  }
  .card-blob {
    position: absolute; width: 100px; height: 100px; background: rgba(255,255,255,0.1);
    border-radius: 50%; top: -30px; right: -30px;
  }

  .report-card { border: 1px solid rgba(0,0,0,0.03); }
  .status-pill { height: 6px; border-radius: 10px; width: 100%; }
  .legend-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

  .bg-danger { background-color: #ff4d4f !important; }
  .bg-success { background-color: #52c41a !important; }
  .bg-warning { background-color: #faad14 !important; }
  .shadow-success { box-shadow: 0 0 8px rgba(82, 196, 26, 0.2); }

  .pagination-btn-top {
    width: 32px; height: 32px; border-radius: 8px; border: none;
    background: #f8f9fa; color: #6366f1; display: flex; align-items: center;
    justify-content: center; transition: 0.2s;
  }
  .pagination-btn-top:disabled { opacity: 0.3; cursor: not-allowed; }
  .pagination-btn-top:hover:not(:disabled) { background: #6366f1; color: white; }

  @media (max-width: 400px) {
    .small-mobile-title { font-size: 1rem; }
    .summary-card { padding: 1.5rem !important; }
  }
`}</style>
    </div>
  );
}

