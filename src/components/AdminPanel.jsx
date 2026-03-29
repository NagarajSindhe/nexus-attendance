export function AdminPanel() {
  const [date, setDate] = useState("");
  const [region, setRegion] = useState("");

  const addHoliday = async () => {
    await addDoc(collection(db, "holidays"), {
      date,
      region,
    });
    alert("Holiday Added");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Admin Panel</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Date (YYYY-MM-DD)"
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Region"
        onChange={(e) => setRegion(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={addHoliday}>
        Add Holiday
      </button>
    </div>
  );
}