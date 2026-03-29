// import React, { useState, useMemo, useEffect } from "react";
// import holidaysData from "./holidays.json";
// import { FaMapMarkerAlt, FaSearch, FaRegCalendarCheck, FaTimesCircle } from "react-icons/fa";

// export default function Holidays() {
//   const [selectedLocation, setSelectedLocation] = useState("Pune");
//   const [searchTerm, setSearchTerm] = useState("");

//   // 1️⃣ Extract all unique locations correctly
//   const allLocations = useMemo(() => {
//     const locations = new Set();
//     holidaysData.forEach((h) => {
//       if (Array.isArray(h.location)) {
//         h.location.forEach((loc) => locations.add(loc));
//       }
//     });
//     return Array.from(locations).sort();
//   }, []);

//   // 2️⃣ Auto-detect location on mount
//   useEffect(() => {
//     fetch("https://ipapi.co")
//       .then((res) => res.json())
//       .then((data) => {
//         // If detected city exists in our list, switch to it
//         const cityMatch = allLocations.find(l => l.toLowerCase() === data.city?.toLowerCase());
//         if (cityMatch) setSelectedLocation(cityMatch);
//       })
//       .catch(() => console.log("Location detection skipped"));
//   }, [allLocations]);

//   // 3️⃣ IMPROVED SEARCH & FILTER LOGIC
//   const filteredHolidays = useMemo(() => {
//     const lowerSearch = searchTerm.toLowerCase().trim();
    
//     return holidaysData
//       .filter((h) => {
//         // Match Location
//         const matchesLocation = h.location.includes(selectedLocation);
//         // Match Search Term (Name of holiday)
//         const matchesSearch = h.type.toLowerCase().includes(lowerSearch);
        
//         return matchesLocation && matchesSearch;
//       })
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [selectedLocation, searchTerm]);

//   // 4️⃣ Group by Month
//   const groupedHolidays = useMemo(() => {
//     return filteredHolidays.reduce((acc, h) => {
//       const month = new Date(h.date).toLocaleString("default", { month: "long" });
//       if (!acc[month]) acc[month] = [];
//       acc[month].push(h);
//       return acc;
//     }, {});
//   }, [filteredHolidays]);

//   const getDayAccent = (dateStr) => {
//     const date = new Date(dateStr);
//     const isPast = date < new Date().setHours(0, 0, 0, 0);
//     if (isPast) return "#adb5bd"; 
//     return "#0d6efd"; 
//   };

//   return (
//     <div className="container py-4">
//       {/* 🔹 SEARCH & LOCATION CARD */}
//       <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "24px" }}>
//         <div className="row align-items-center g-3">
//           <div className="col-12 col-md-6">
//             <h4 className="fw-bold mb-1">Holiday Explorer</h4>
//             <p className="text-muted small mb-0">Browsing holidays for {selectedLocation}</p>
//           </div>
          
//           <div className="col-12 col-md-6">
//             <div className="position-relative">
//               <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
//               <input 
//                 type="text" 
//                 className="form-control ps-5 border-0 bg-light rounded-pill p-2" 
//                 placeholder="Search holiday name (e.g. Diwali)..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm && (
//                 <FaTimesCircle 
//                   className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted cursor-pointer" 
//                   onClick={() => setSearchTerm("")}
//                   style={{ cursor: 'pointer' }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="d-flex align-items-center gap-2 overflow-auto mt-4 pb-2" style={{ scrollbarWidth: "none" }}>
//           <FaMapMarkerAlt className="text-primary me-1 flex-shrink-0" />
//           {allLocations.map((loc) => (
//             <button
//               key={loc}
//               onClick={() => setSelectedLocation(loc)}
//               className={`btn rounded-pill px-4 py-1 fw-bold transition-all border-0 ${
//                 selectedLocation === loc ? "btn-primary shadow-sm" : "btn-light text-muted"
//               }`}
//               style={{ whiteSpace: "nowrap", fontSize: "13px" }}
//             >
//               {loc}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 🔹 RESULTS SECTION */}
//       {Object.keys(groupedHolidays).length > 0 ? (
//         Object.entries(groupedHolidays).map(([month, holidays]) => (
//           <div key={month} className="mb-4">
//             <div className="d-flex align-items-center gap-2 mb-3 px-2">
//                <div style={{ height: '2px', width: '20px', background: '#0d6efd' }}></div>
//                <h6 className="text-uppercase fw-bold text-dark mb-0 mb-0" style={{ letterSpacing: '1px' }}>{month}</h6>
//             </div>
//             <div className="row g-3">
//               {holidays.map((h, idx) => {
//                 const holidayDate = new Date(h.date);
//                 const isPast = holidayDate < new Date().setHours(0, 0, 0, 0);
//                 const accentColor = getDayAccent(h.date);

//                 return (
//                   <div key={idx} className="col-12 col-lg-6">
//                     <div className={`card border-0 shadow-sm h-100 rounded-4 overflow-hidden transition-all hover-card ${isPast ? 'opacity-60' : ''}`}>
//                       <div className="d-flex align-items-center p-3">
//                         <div 
//                           className="rounded-3 d-flex flex-column justify-content-center align-items-center text-white shadow-sm" 
//                           style={{ backgroundColor: accentColor, minWidth: "60px", height: "60px" }}
//                         >
//                           <span className="fw-bold h4 mb-0">{holidayDate.getDate()}</span>
//                           <span className="text-uppercase fw-bold" style={{ fontSize: "9px" }}>
//                             {holidayDate.toLocaleDateString('en-US', { weekday: 'short' })}
//                           </span>
//                         </div>

//                         <div className="ms-3 flex-grow-1">
//                           <h6 className={`mb-1 fw-bold ${isPast ? 'text-decoration-line-through' : ''}`}>
//                             {h.type}
//                           </h6>
//                           <div className="d-flex align-items-center gap-2">
//                              <span className="text-muted small">Public Holiday</span>
//                              {isPast ? 
//                                <span className="badge bg-secondary rounded-pill" style={{fontSize: '8px'}}>Completed</span> : 
//                                <span className="badge bg-primary-subtle text-primary rounded-pill" style={{fontSize: '8px'}}>Upcoming</span>
//                              }
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-5 card border-0 shadow-sm rounded-5 mt-4">
//           <div className="display-1 text-light mb-3">🔍</div>
//           <h5 className="text-muted">No holidays found for "{searchTerm}"</h5>
//           <p className="text-muted small">Try checking a different location or clearing your search.</p>
//           <button className="btn btn-primary rounded-pill mt-2" onClick={() => setSearchTerm("")}>Clear Search</button>
//         </div>
//       )}

//       <style>{`
//         .hover-card:hover { transform: scale(1.02); transition: 0.2s ease-in-out; }
//         .cursor-pointer { cursor: pointer; }
//       `}</style>
//     </div>
//   );
// }


// import React, { useState, useMemo, useEffect } from "react";
// import holidaysData from "./holidays.json";
// import { FaMapMarkerAlt, FaSearch, FaRegCalendarCheck, FaTimesCircle, FaGlobeAsia } from "react-icons/fa";

// export default function Holidays() {
//   const [selectedLocation, setSelectedLocation] = useState("All"); // Changed default to 'All' for better search
//   const [searchTerm, setSearchTerm] = useState("");

//   // 1️⃣ Extract all unique locations + Add an "All" option
//   const allLocations = useMemo(() => {
//     const locations = new Set();
//     holidaysData.forEach((h) => {
//       if (Array.isArray(h.location)) {
//         h.location.forEach((loc) => locations.add(loc));
//       }
//     });
//     return ["All", ...Array.from(locations).sort()];
//   }, []);

//   // 2️⃣ Auto-detect location on mount
//   useEffect(() => {
//     fetch("https://ipapi.co")
//       .then((res) => res.json())
//       .then((data) => {
//         const cityMatch = allLocations.find(l => l.toLowerCase() === data.city?.toLowerCase());
//         if (cityMatch) setSelectedLocation(cityMatch);
//       })
//       .catch(() => console.log("Location detection skipped"));
//   }, [allLocations]);

//   // 3️⃣ GLOBAL SEARCH LOGIC (Searches Type AND Location)
//   const filteredHolidays = useMemo(() => {
//     const query = searchTerm.toLowerCase().trim();
    
//     return holidaysData
//       .filter((h) => {
//         const holidayName = h.type.toLowerCase();
//         const locations = h.location.map(l => l.toLowerCase());
        
//         // Logic: Match the button filter OR match the search text (name or city)
//         const matchesButton = selectedLocation === "All" || h.location.includes(selectedLocation);
//         const matchesSearch = query === "" || 
//                              holidayName.includes(query) || 
//                              locations.some(loc => loc.includes(query));

//         return matchesButton && matchesSearch;
//       })
//       .sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [selectedLocation, searchTerm]);

//   // 4️⃣ Group by Month
//   const groupedHolidays = useMemo(() => {
//     return filteredHolidays.reduce((acc, h) => {
//       const month = new Date(h.date).toLocaleString("default", { month: "long" });
//       if (!acc[month]) acc[month] = [];
//       acc[month].push(h);
//       return acc;
//     }, {});
//   }, [filteredHolidays]);

//   return (
//     <div className="container py-4">
//       <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: "24px", background: "linear-gradient(to right, #ffffff, #f8f9ff)" }}>
//         <div className="row align-items-center g-3">
//           <div className="col-12 col-md-6">
//             <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
//               <FaGlobeAsia className="text-primary" /> Holiday Explorer
//             </h4>
//             <p className="text-muted small mb-0">
//               {selectedLocation === "All" ? "Showing all regional holidays" : `Filtering by ${selectedLocation}`}
//             </p>
//           </div>
          
//           <div className="col-12 col-md-6">
//             <div className="position-relative">
//               <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
//               <input 
//                 type="text" 
//                 className="form-control ps-5 border-0 bg-white shadow-sm rounded-pill p-3" 
//                 placeholder="Search holiday or city (e.g. Pune, Christmas)..." 
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{ fontSize: '14px' }}
//               />
//               {searchTerm && (
//                 <FaTimesCircle 
//                   className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" 
//                   onClick={() => setSearchTerm("")}
//                   style={{ cursor: 'pointer', zIndex: 10 }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* 🔹 Location Pills */}
//         <div className="d-flex align-items-center gap-2 overflow-auto mt-4 pb-2" style={{ scrollbarWidth: "none" }}>
//           <span className="text-muted small fw-bold text-uppercase me-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>Quick Filters:</span>
//           {allLocations.map((loc) => (
//             <button
//               key={loc}
//               onClick={() => setSelectedLocation(loc)}
//               className={`btn rounded-pill px-4 py-1 fw-bold transition-all border ${
//                 selectedLocation === loc ? "btn-primary border-primary shadow-sm" : "btn-light border-light text-muted"
//               }`}
//               style={{ whiteSpace: "nowrap", fontSize: "12px" }}
//             >
//               {loc}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 🔹 List View */}
//       {Object.keys(groupedHolidays).length > 0 ? (
//         Object.entries(groupedHolidays).map(([month, holidays]) => (
//           <div key={month} className="mb-4 animate-fade-in">
//             <div className="d-flex align-items-center gap-3 mb-3 px-2">
//                <h6 className="text-uppercase fw-bold text-primary mb-0" style={{ letterSpacing: '2px', fontSize: '12px' }}>{month}</h6>
//                <div className="flex-grow-1" style={{ height: '1px', background: 'linear-gradient(to right, #dee2e6, transparent)' }}></div>
//             </div>
//             <div className="row g-3">
//               {holidays.map((h, idx) => {
//                 const hDate = new Date(h.date);
//                 const isPast = hDate < new Date().setHours(0, 0, 0, 0);

//                 return (
//                   <div key={idx} className="col-12 col-lg-6">
//                     <div className={`card border-0 shadow-sm h-100 rounded-4 transition-all hover-card ${isPast ? 'bg-light opacity-75' : 'bg-white'}`}>
//                       <div className="d-flex align-items-center p-3">
//                         <div className={`rounded-4 d-flex flex-column justify-content-center align-items-center text-white p-3 ${isPast ? 'bg-secondary' : 'bg-primary'}`} 
//                              style={{ minWidth: "70px", height: "70px", boxShadow: isPast ? 'none' : '0 8px 15px rgba(13, 110, 253, 0.2)' }}>
//                           <span className="fw-bold h3 mb-0">{hDate.getDate()}</span>
//                           <span className="text-uppercase fw-bold" style={{ fontSize: '9px' }}>{hDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
//                         </div>

//                         <div className="ms-3 flex-grow-1">
//                           <h6 className={`mb-1 fw-bold ${isPast ? 'text-muted' : 'text-dark'}`}>{h.type}</h6>
//                           <div className="d-flex flex-wrap gap-1 mt-1">
//                              {h.location.map(loc => (
//                                <span key={loc} className="badge bg-light text-primary border border-primary border-opacity-10 fw-normal rounded-pill" style={{fontSize: '9px'}}>
//                                  {loc}
//                                </span>
//                              ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-5 rounded-5 bg-white shadow-sm border border-light">
//           <div className="display-4 mb-3">🏝️</div>
//           <h5 className="fw-bold text-dark">No matches found</h5>
//           <p className="text-muted">Try searching for a different holiday name or city.</p>
//           <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => {setSearchTerm(""); setSelectedLocation("All");}}>Reset Explorer</button>
//         </div>
//       )}

//       <style>{`
//         .hover-card:hover { transform: translateY(-4px); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
//         .animate-fade-in { animation: fadeIn 0.5s ease-in; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useMemo, useEffect } from "react";
import holidaysData from "./holidays.json";
import { FaMapMarkerAlt, FaSearch, FaRegCalendarCheck, FaTimesCircle, FaGlobeAsia } from "react-icons/fa";

export default function Holidays() {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const allLocations = useMemo(() => {
    const locations = new Set();
    holidaysData.forEach((h) => {
      if (Array.isArray(h.location)) {
        h.location.forEach((loc) => locations.add(loc));
      }
    });
    return ["All", ...Array.from(locations).sort()];
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co")
      .then((res) => res.json())
      .then((data) => {
        const cityMatch = allLocations.find(l => l.toLowerCase() === data.city?.toLowerCase());
        if (cityMatch) setSelectedLocation(cityMatch);
      })
      .catch(() => console.log("Location detection skipped"));
  }, [allLocations]);

  const filteredHolidays = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return holidaysData
      .filter((h) => {
        const holidayName = h.type.toLowerCase();
        const locations = h.location.map(l => l.toLowerCase());
        const matchesButton = selectedLocation === "All" || h.location.includes(selectedLocation);
        const matchesSearch = query === "" || 
                             holidayName.includes(query) || 
                             locations.some(loc => loc.includes(query));
        return matchesButton && matchesSearch;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [selectedLocation, searchTerm]);

  const groupedHolidays = useMemo(() => {
    return filteredHolidays.reduce((acc, h) => {
      const month = new Date(h.date).toLocaleString("default", { month: "long" });
      if (!acc[month]) acc[month] = [];
      acc[month].push(h);
      return acc;
    }, {});
  }, [filteredHolidays]);

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm p-4 mb-4 header-card">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-6">
            <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <FaGlobeAsia className="text-primary" /> Holiday Explorer
            </h4>
            <p className="text-muted small mb-0">
              {selectedLocation === "All" ? "Showing all regional holidays" : `Filtering by ${selectedLocation}`}
            </p>
          </div>
          
          <div className="col-12 col-md-6">
            <div className="position-relative">
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input 
                type="text" 
                className="form-control ps-5 border-0 bg-white shadow-sm rounded-pill p-3" 
                placeholder="Search holiday or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '14px' }}
              />
              {searchTerm && (
                <FaTimesCircle 
                  className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" 
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: 'pointer', zIndex: 10 }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 overflow-auto mt-4 pb-2 scroll-hide">
          {allLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`btn rounded-pill px-4 py-1 fw-bold transition-all border ${
                selectedLocation === loc ? "btn-primary border-primary shadow-sm" : "btn-light border-light text-muted"
              }`}
              style={{ whiteSpace: "nowrap", fontSize: "12px" }}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(groupedHolidays).length > 0 ? (
        Object.entries(groupedHolidays).map(([month, holidays]) => (
          <div key={month} className="mb-4 animate-fade-in">
            {/* 🔹 FIXED MONTH HEADER WITH BACKGROUND FOR MOBILE */}
            <div className="month-header d-flex align-items-center gap-3 mb-3 px-3 py-2 rounded-4">
               <h6 className="text-uppercase fw-bold text-primary mb-0" style={{ letterSpacing: '2px', fontSize: '13px' }}>{month}</h6>
               <div className="flex-grow-1 header-line"></div>
            </div>
            
            <div className="row g-3">
              {holidays.map((h, idx) => {
                const hDate = new Date(h.date);
                const isPast = hDate < new Date().setHours(0, 0, 0, 0);

                return (
                  <div key={idx} className="col-12 col-lg-6">
                    <div className={`card border-0 shadow-sm h-100 rounded-4 transition-all hover-card ${isPast ? 'bg-light opacity-75' : 'bg-white'}`}>
                      <div className="d-flex align-items-center p-3">
                        <div className={`date-box rounded-4 d-flex flex-column justify-content-center align-items-center text-white p-3 ${isPast ? 'bg-secondary' : 'bg-primary'}`}>
                          <span className="fw-bold h3 mb-0">{hDate.getDate()}</span>
                          <span className="text-uppercase fw-bold" style={{ fontSize: '9px' }}>{hDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        </div>

                        <div className="ms-3 flex-grow-1">
                          <h6 className={`mb-1 fw-bold ${isPast ? 'text-muted' : 'text-dark'}`}>{h.type}</h6>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                             {h.location.map(loc => (
                               <span key={loc} className="badge bg-light text-primary border border-primary border-opacity-10 fw-normal rounded-pill" style={{fontSize: '9px'}}>
                                 {loc}
                               </span>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-5 rounded-5 bg-white shadow-sm border border-light">
          <div className="display-4 mb-3">🏝️</div>
          <h5 className="fw-bold text-dark">No matches found</h5>
          <button className="btn btn-outline-primary btn-sm rounded-pill mt-2" onClick={() => {setSearchTerm(""); setSelectedLocation("All");}}>Reset</button>
        </div>
      )}

      <style>{`
        .header-card { border-radius: 24px; background: linear-gradient(to right, #ffffff, #f8f9ff); }
        .scroll-hide::-webkit-scrollbar { display: none; }
        
        /* 🎨 FIX: Background for Month Header */
        .month-header { 
          background: rgba(255, 255, 255, 0.7); 
          backdrop-filter: blur(8px);
          position: sticky;
          top: 80px; /* Adjust based on your layout navbar height */
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        
        .header-line { height: 1px; background: linear-gradient(to right, #dee2e6, transparent); }
        .date-box { min-width: 70px; height: 70px; box-shadow: 0 8px 15px rgba(13, 110, 253, 0.1); }
        .hover-card:hover { transform: translateY(-4px); transition: 0.3s ease; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 768px) {
          .month-header { top: 70px; margin-left: -5px; margin-right: -5px; }
        }
      `}</style>
    </div>
  );
}
