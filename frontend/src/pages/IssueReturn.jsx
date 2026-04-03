import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../lib/api";

export default function IssueReturn() {
  const location = useLocation();
  const selectedBook = location.state?.book || null;

  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState(selectedBook?.id ? String(selectedBook.id) : "");
  const [note, setNote] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [members, setMembers] = useState([]);

  const [issued, setIssued] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadIssued() {
    try {
      const [i, m] = await Promise.all([api.get("/issued"), api.get("/members")]);
      setIssued(i.data.issued || []);
      setMembers(m.data.members || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load issue/return data");
    }
  }

  useEffect(() => {
    loadIssued();
  }, []);

  async function onIssue(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/issue", { memberId, bookId, note });
      setMessage("Book issued successfully.");
      setMemberId("");
      setBookId("");
      setNote("");
      await loadIssued();
    } catch (err) {
      setError(err?.response?.data?.message || "Issue failed");
    }
  }

  async function onReturn(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/return", { transactionId });
      const fine = res.data.fine || 0;
      setMessage(fine > 0 ? `Book returned. Fine: Rs. ${fine}` : "Book returned. No fine.");
      setTransactionId("");
      await loadIssued();
    } catch (err) {
      setError(err?.response?.data?.message || "Return failed");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Issue / Return</h1>
      <p className="mt-1 text-sm text-slate-600">Select member and book for issue.</p>

      {message ? <div className="mt-4 rounded-md bg-green-50 p-2 text-sm text-green-700">{message}</div> : null}
      {error ? <div className="mt-4 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <form onSubmit={onIssue} className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">Issue Book</div>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm font-medium">Member</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (ID: {m.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Book ID</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="e.g. 2"
                required
              />
              {selectedBook ? (
                <p className="mt-1 text-xs text-slate-500">
                  Selected: {selectedBook.title} by {selectedBook.author}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium">Note</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note"
              />
            </div>
            <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
              Issue
            </button>
          </div>
        </form>

        <form onSubmit={onReturn} className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">Return Book</div>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm font-medium">Transaction ID</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 3"
                required
              />
            </div>
            <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
              Return
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <div className="mb-2 text-sm font-semibold">Currently Issued (Active)</div>
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2">Txn ID</th>
                <th className="px-4 py-2">Member</th>
                <th className="px-4 py-2">Book</th>
                <th className="px-4 py-2">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {issued.length ? (
                issued.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{t.id}</td>
                    <td className="px-4 py-2">
                      {t.member?.name} (ID: {t.member?.id})
                    </td>
                    <td className="px-4 py-2">
                      {t.book?.title} (ID: {t.book?.id})
                    </td>
                    <td className="px-4 py-2">{new Date(t.issueDate).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-slate-600" colSpan={4}>
                    No active issues.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

