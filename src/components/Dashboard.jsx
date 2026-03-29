// import React, { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import holidaysData from "./holidays.json";

// export default function Dashboard({ user }) {
//   const [stats, setStats] = useState({
//     yearly: { working: 0, office: 0, remote: 0, leave: 0, percent: 0 },
//     monthly: { working: 0, office: 0, remote: 0, leave: 0, percent: 0 },
//   });
//   const [currentMonthHolidays, setCurrentMonthHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const today = new Date();
//   const USER_LOCATION = "Pune";

//   // 🎨 COLOR THEME: Matches your Calendar colors
//   const getDayAccent = (dateStr) => {
//     const day = new Date(dateStr).getDay();
//     switch (day) {
//       case 1: return "#0d6efd"; // Mon - Blue
//       case 2: return "#6610f2"; // Tue - Indigo
//       case 3: return "#6f42c1"; // Wed - Purple
//       case 4: return "#0dcaf0"; // Thu - Teal
//       case 5: return "#198754"; // Fri - Green
//       case 0: case 6: return "#dc3545"; // Weekend - Red
//       default: return "#dee2e6";
//     }
//   };

//   const getLocalFormat = (date) => {
//     const d = new Date(date);
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
//   };

//   const calculateStats = (startDate, endDate, attendanceMap) => {
//     let office = 0, remote = 0, leave = 0, totalWorkingDays = 0;

//     let current = new Date(startDate);
//     while (current <= endDate) {
//       const dateStr = getLocalFormat(current);
//       const isWeekend = current.getDay() === 0 || current.getDay() === 6;
//       const isHoliday = holidaysData.some(h => h.date === dateStr && h.location.includes(USER_LOCATION));

//       if (!isWeekend && !isHoliday) {
//         totalWorkingDays++;
//         const status = attendanceMap[dateStr];
//         if (status === "In-Office") office++;
//         else if (status === "Leave") leave++;
//         else remote++;
//       }
//       current.setDate(current.getDate() + 1);
//     }

//     const percent = totalWorkingDays > 0 ? ((office / totalWorkingDays) * 100).toFixed(1) : 0;
//     return { working: totalWorkingDays, office, remote, leave, percent };
//   };

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!user?.uid) return;
//       setLoading(true);

//       try {
//         const attendanceRef = collection(db, "users", user.uid, "attendance");
//         const snap = await getDocs(attendanceRef);

//         let attendanceMap = {};
//         snap.forEach((doc) => {
//           const data = doc.data();
//           if (data.days) attendanceMap = { ...attendanceMap, ...data.days };
//         });

//         // 📅 Calculate Holidays for Current Month
//         const monthHolidays = holidaysData.filter(h => {
//           const hDate = new Date(h.date);
//           return h.location.includes(USER_LOCATION) &&
//                  hDate.getMonth() === today.getMonth() &&
//                  hDate.getFullYear() === today.getFullYear();
//         });
//         setCurrentMonthHolidays(monthHolidays);

//         setStats({
//           yearly: calculateStats(new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31), attendanceMap),
//           monthly: calculateStats(new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0), attendanceMap),
//         });
//       } catch (error) {
//         console.error("Fetch Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [user]);

//   if (loading) return <div className="text-center mt-5"><h5>Loading Tracker...</h5></div>;

//   return (
//     <div className="container py-4">
//       <div className="row g-4">
//         {/* YEARLY CARD */}
//         <div className="col-md-6">
//           <div className="card p-4 shadow-sm border-0 bg-dark text-white h-100" style={{ borderRadius: "24px" }}>
//             <small className="text-uppercase text-muted fw-bold ls-1">Yearly Progress ({today.getFullYear()})</small>
//             <h1 className="display-2 fw-bold text-warning my-3">{stats.yearly.percent}%</h1>
//             <div className="mt-auto">
//               <div className="d-flex justify-content-between border-bottom border-secondary pb-2 mb-2">
//                 <span>In-Office Days</span>
//                 <span className="fw-bold text-success">{stats.yearly.office}</span>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <span>Total Working Days</span>
//                 <span className="fw-bold text-light">{stats.yearly.working}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* MONTHLY CARD */}
//         <div className="col-md-6">
//           <div className="card p-4 shadow-sm border-0 h-100" style={{ borderRadius: "24px", backgroundColor: "#f0f7f8" }}>
//             <small className="text-uppercase text-muted fw-bold ls-1">{today.toLocaleString('default', { month: 'long' })} Goal</small>
//             <h1 className="display-2 fw-bold text-primary my-3">{stats.monthly.percent}%</h1>
//             <div className="mt-auto">
//               <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
//                 <span>In-Office Days</span>
//                 <span className="fw-bold text-primary">{stats.monthly.office}</span>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <span>Working Days</span>
//                 <span className="fw-bold text-dark">{stats.monthly.working}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🔹 VIBRANT TIMELINE HOLIDAYS LIST */}
//       <div className="mt-4 p-4 bg-white shadow-sm border-0" style={{ borderRadius: "24px" }}>
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h6 className="fw-bold mb-0 text-dark">Current Holidays</h6>
//           <span className="badge bg-primary bg-opacity-10 text-primary border-0 rounded-pill px-3 py-2 fw-bold">
//             {today.toLocaleString('default', { month: 'long' })}
//           </span>
//         </div>

//         {currentMonthHolidays.length > 0 ? (
//           <div className="d-flex flex-column gap-3">
//             {currentMonthHolidays.map((h, idx) => {
//               const accentColor = getDayAccent(h.date);
//               const holidayDate = new Date(h.date);
//               return (
//                 <div key={idx} className="d-flex align-items-center p-2 rounded-4 border border-light shadow-xs" style={{ backgroundColor: "#ffffff" }}>

//                   {/* 🎨 COLORFUL DATE BLOCK */}
//                   <div className="text-center rounded-3 d-flex flex-column justify-content-center shadow-sm"
//                        style={{ backgroundColor: accentColor, minWidth: "60px", height: "60px", color: "#fff" }}>
//                     <span className="d-block fw-bold h4 mb-0">{holidayDate.getDate()}</span>
//                     <span className="text-uppercase fw-bold" style={{ fontSize: "9px", opacity: 0.9 }}>
//                       {holidayDate.toLocaleDateString('en-US', { weekday: 'short' })}
//                     </span>
//                   </div>

//                   {/* HOLIDAY DETAILS */}
//                   <div className="ps-3 flex-grow-1">
//                     <p className="mb-0 fw-bold text-dark" style={{ fontSize: "15px" }}>{h.type}</p>
//                     <div className="d-flex align-items-center gap-2">
//                       <span className="dot" style={{ height: "6px", width: "6px", backgroundColor: accentColor, borderRadius: "50%" }}></span>
//                       <span className="text-muted fw-medium" style={{ fontSize: "11px" }}>{USER_LOCATION} Holiday</span>
//                     </div>
//                   </div>

//                   <div className="pe-3">
//                      <span className="badge rounded-pill bg-light text-muted border-0 fw-bold" style={{fontSize: '9px'}}>OFF</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-4 bg-light rounded-4">
//             <p className="text-muted small mb-0 fw-bold">No public holidays this month.</p>
//           </div>
//         )}
//       </div>

//       <div className="alert mt-4 px-3 py-2 border-0 text-center text-muted small" style={{backgroundColor: "#eee", borderRadius: "12px"}}>
//         <strong>Formula:</strong> (Office / Total Working Days) × 100 <br/>
//         <span className="text-secondary">Excludes Weekends & Holidays. Target working days: {stats.monthly.working}</span>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import holidaysData from "./holidays.json";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    yearly: { working: 0, office: 0, remote: 0, leave: 0, percent: 0 },
    monthly: { working: 0, office: 0, remote: 0, leave: 0, percent: 0 },
  });
  const [currentMonthHolidays, setCurrentMonthHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🤖 Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm Nexus AI. Ask me about your office goal, holidays, or attendance status.",
    },
  ]);
  const chatEndRef = useRef(null);

  const today = new Date();
  const USER_LOCATION = "Pune";

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  const getDayAccent = (dateStr) => {
    const day = new Date(dateStr).getDay();
    switch (day) {
      case 1:
        return "#0d6efd";
      case 2:
        return "#6610f2";
      case 3:
        return "#6f42c1";
      case 4:
        return "#0dcaf0";
      case 5:
        return "#198754";
      default:
        return "#dc3545";
    }
  };

  const getLocalFormat = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const calculateStats = (startDate, endDate, attendanceMap) => {
    let office = 0,
      remote = 0,
      leave = 0,
      totalWorkingDays = 0;
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = getLocalFormat(current);
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isHoliday = holidaysData.some(
        (h) => h.date === dateStr && h.location.includes(USER_LOCATION),
      );
      if (!isWeekend && !isHoliday) {
        totalWorkingDays++;
        const status = attendanceMap[dateStr];
        if (status === "In-Office") office++;
        else if (status === "Leave") leave++;
        else remote++;
      }
      current.setDate(current.getDate() + 1);
    }
    const percent =
      totalWorkingDays > 0 ? ((office / totalWorkingDays) * 100).toFixed(1) : 0;
    return { working: totalWorkingDays, office, remote, leave, percent };
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const attendanceRef = collection(db, "users", user.uid, "attendance");
        const snap = await getDocs(attendanceRef);
        let attendanceMap = {};
        snap.forEach((doc) => {
          if (doc.data().days)
            attendanceMap = { ...attendanceMap, ...doc.data().days };
        });

        const monthHolidays = holidaysData.filter((h) => {
          const hDate = new Date(h.date);
          return (
            h.location.includes(USER_LOCATION) &&
            hDate.getMonth() === today.getMonth()
          );
        });
        setCurrentMonthHolidays(monthHolidays);

        setStats({
          yearly: calculateStats(
            new Date(today.getFullYear(), 0, 1),
            new Date(today.getFullYear(), 11, 31),
            attendanceMap,
          ),
          monthly: calculateStats(
            new Date(today.getFullYear(), today.getMonth(), 1),
            new Date(today.getFullYear(), today.getMonth() + 1, 0),
            attendanceMap,
          ),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // 🤖 Chatbot Logic
  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const input = chatInput.toLowerCase();
    const userMsg = { role: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      let response =
        "I'm not sure about that. Try asking about 'status', 'goal', or 'holidays'.";

      if (
        input.includes("goal") ||
        input.includes("percent") ||
        input.includes("target")
      ) {
        const needed =
          Math.ceil(0.6 * stats.monthly.working) - stats.monthly.office;
        response =
          stats.monthly.percent >= 60
            ? `Great job! You've hit your 60% goal with ${stats.monthly.percent}% presence.`
            : `You are at ${stats.monthly.percent}%. You need ${needed > 0 ? needed : 0} more office days to hit the 60% target.`;
      } else if (input.includes("holiday")) {
        response =
          currentMonthHolidays.length > 0
            ? `You have ${currentMonthHolidays.length} holidays this month: ${currentMonthHolidays.map((h) => h.type).join(", ")}.`
            : "There are no holidays for your location this month.";
      } else if (input.includes("status") || input.includes("office")) {
        response = `This month: ${stats.monthly.office} Office days, ${stats.monthly.remote} Remote, and ${stats.monthly.leave} Leaves.`;
      }

      // Check if user is asking for Yearly specifically
      if (input.includes("year")) {
        const yearlyNeeded =
          Math.ceil(0.6 * stats.yearly.working) - stats.yearly.office;

        response =
          stats.yearly.percent >= 60
            ? `You are doing great! Your yearly presence is already at ${stats.yearly.percent}%.`
            : `For the whole year (${today.getFullYear()}), you are at ${stats.yearly.percent}%. You need ${yearlyNeeded > 0 ? yearlyNeeded : 0} more office days to achieve your 60% yearly target.`;
      } else {
        // Default to Monthly logic
        const monthlyNeeded =
          Math.ceil(0.6 * stats.monthly.working) - stats.monthly.office;

        response =
          stats.monthly.percent >= 60
            ? `Great job! You've hit your monthly 60% goal with ${stats.monthly.percent}% presence.`
            : `This month, you are at ${stats.monthly.percent}%. You need ${monthlyNeeded > 0 ? monthlyNeeded : 0} more office days to hit the 60% target.`;
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }]);
    }, 600);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h5>Loading Tracker...</h5>
      </div>
    );

  return (
    <div className="container py-4" style={{ position: "relative" }}>
      <div className="row g-4">
        {/* YEARLY CARD */}
        <div className="col-md-6">
          <div
            className="card p-4 shadow-sm border-0 bg-dark text-white h-100"
            style={{ borderRadius: "24px" }}
          >
            <small className="text-uppercase text-muted fw-bold ls-1">
              Yearly Progress ({today.getFullYear()})
            </small>
            <h1 className="display-2 fw-bold text-warning my-3">
              {stats.yearly.percent}%
            </h1>
            <div className="mt-auto">
              <div className="d-flex justify-content-between border-bottom border-secondary pb-2 mb-2">
                <span>In-Office Days</span>
                <span className="fw-bold text-success">
                  {stats.yearly.office}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Working Days</span>
                <span className="fw-bold text-light">
                  {stats.yearly.working}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MONTHLY CARD */}
        <div className="col-md-6">
          <div
            className="card p-4 shadow-sm border-0 h-100"
            style={{ borderRadius: "24px", backgroundColor: "#f0f7f8" }}
          >
            <small className="text-uppercase text-muted fw-bold ls-1">
              {today.toLocaleString("default", { month: "long" })} Goal
            </small>
            <h1 className="display-2 fw-bold text-primary my-3">
              {stats.monthly.percent}%
            </h1>
            <div className="mt-auto">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span>In-Office Days</span>
                <span className="fw-bold text-primary">
                  {stats.monthly.office}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Working Days</span>
                <span className="fw-bold text-dark">
                  {stats.monthly.working}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 HOLIDAYS LIST */}
      <div
        className="mt-4 p-4 bg-white shadow-sm border-0"
        style={{ borderRadius: "24px" }}
      >
        <h6 className="fw-bold mb-4 text-dark">Current Holidays</h6>
        {currentMonthHolidays.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {currentMonthHolidays.map((h, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center p-2 rounded-4 border border-light bg-white shadow-xs"
              >
                <div
                  className="text-center rounded-3 d-flex flex-column justify-content-center shadow-sm"
                  style={{
                    backgroundColor: getDayAccent(h.date),
                    minWidth: "60px",
                    height: "60px",
                    color: "#fff",
                  }}
                >
                  <span className="fw-bold h4 mb-0">
                    {new Date(h.date).getDate()}
                  </span>
                  <span
                    className="text-uppercase fw-bold"
                    style={{ fontSize: "9px", opacity: 0.9 }}
                  >
                    {new Date(h.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                </div>
                <div className="ps-3 flex-grow-1">
                  <p
                    className="mb-0 fw-bold text-dark"
                    style={{ fontSize: "15px" }}
                  >
                    {h.type}
                  </p>
                  <span className="text-muted small">
                    {USER_LOCATION} Holiday
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No holidays this month.</p>
        )}
      </div>

      {/* 🤖 FLOATING CHATBOT UI */}
      <div
        className={`chatbot-container shadow-lg ${isChatOpen ? "active" : ""}`}
      >
        <div className="chat-header d-flex justify-content-between align-items-center">
          <span className="fw-bold">
            <FaRobot className="me-2" /> Nexus AI
          </span>
          <FaTimes
            onClick={() => setIsChatOpen(false)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="chat-body p-3">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-footer p-2 d-flex gap-2" onSubmit={handleChat}>
          <input
            type="text"
            className="form-control rounded-pill border-0 bg-light"
            placeholder="Ask Nexus..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary rounded-circle p-2">
            <FaPaperPlane size={14} />
          </button>
        </form>
      </div>

      <button
        className="chat-fab shadow-lg"
        onClick={() => setIsChatOpen(true)}
      >
        <FaCommentDots />
      </button>

      <style>{`
        .chat-fab { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: #0d6efd; color: white; border: none; font-size: 24px; z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .chatbot-container { position: fixed; bottom: 100px; right: 30px; width: 320px; height: 450px; background: white; border-radius: 20px; display: none; flex-direction: column; overflow: hidden; z-index: 2001; border: 1px solid #eee; }
        .chatbot-container.active { display: flex; }
        .chat-header { background: #0d6efd; color: white; padding: 15px; }
        .chat-body { flex: 1; overflow-y: auto; background: #f8f9fa; display: flex; flex-direction: column; gap: 10px; }
        .chat-bubble { padding: 8px 12px; border-radius: 15px; font-size: 13px; max-width: 85%; line-height: 1.4; }
        .chat-bubble.ai { background: #e9ecef; align-self: flex-start; color: #333; }
        .chat-bubble.user { background: #0d6efd; color: white; align-self: flex-end; }
        .ls-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
}
