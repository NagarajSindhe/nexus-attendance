// import React from "react";
// import { db } from "../firebase";
// import { collection, doc, writeBatch } from "firebase/firestore";

// export default function AdminView() {

//   const upload = async () => {
//     const batch = writeBatch(db);
//     const ref = doc(collection(db, "holidays"));

//     batch.set(ref, {
//       name: "Christmas",
//       date: "2026-12-25"
//     });

//     await batch.commit();
//     alert("Holiday added");
//   };

//   return (
//     <div>
//       <h2>Admin Panel</h2>
//       <button onClick={upload} className="btn btn-primary">
//         Upload Holiday
//       </button>
//     </div>
//   );
// }

import React from "react";
import { db } from "../firebase";
import { collection, doc, writeBatch } from "firebase/firestore";

export default function AdminView() {

  const upload = async () => {
    const batch = writeBatch(db);

    const holidays = [
      { date: "2026-01-26", name: "Republic Day" },
      { date: "2026-08-15", name: "Independence Day" }
    ];

    holidays.forEach(h => {
      const ref = doc(collection(db, "holidays"));
      batch.set(ref, h);
    });

    await batch.commit();
    alert("Holidays added");
  };

  return (
    <div>
      <h3>Admin</h3>
      <button onClick={upload} className="btn btn-primary">
        Upload Holidays
      </button>
    </div>
  );
}