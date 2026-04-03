import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Borrowers() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/borrowers")
      .then((res) => setRows(res.data.borrowers || []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load borrowers"));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Borrowers</h1>
      <p className="mt-1 text-sm text-slate-600">Current and past borrower records.</p>
      {error ? <div className="mt-4 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2">Member Name</th>
              <th className="px-4 py-2">Note</th>
              <th className="px-4 py-2">Book</th>
              <th className="px-4 py-2">Borrow Date</th>
              <th className="px-4 py-2">Return Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.member?.name}</td>
                <td className="px-4 py-2">{r.note || "-"}</td>
                <td className="px-4 py-2">{r.book?.title}</td>
                <td className="px-4 py-2">{new Date(r.issueDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "Not returned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

