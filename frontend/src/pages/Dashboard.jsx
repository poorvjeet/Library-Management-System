import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        setError("");
        const res = await api.get("/dashboard/summary");
        if (!mounted) return;
        setSummary(res.data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(
    () => ({
      totalBooks: summary?.totalBooks || 0,
      issuedBooks: summary?.issuedBooks || 0,
      totalMembers: summary?.totalMembers || 0
    }),
    [summary]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Quick buttons + borrowing chart overview.</p>
      {error ? <div className="mt-4 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

      {loading ? (
        <div className="mt-6 rounded-lg border bg-white p-4 text-slate-600">Loading...</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Total Books" value={totals.totalBooks} />
          <Stat label="Issued Books (Active)" value={totals.issuedBooks} />
          <Stat label="Total Members" value={totals.totalMembers} />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">Total Borrowing Book Chart (Top 5)</div>
          <div className="mt-4 space-y-2">
            {(summary?.borrowingChart || []).map((x) => (
              <div key={x.bookId}>
                <div className="mb-1 flex justify-between text-xs text-slate-600">
                  <span>{x.title}</span>
                  <span>{x.count}</span>
                </div>
                <div className="h-2 rounded bg-slate-100">
                  <div
                    className="h-2 rounded bg-sky-500"
                    style={{ width: `${Math.min(100, x.count * 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">Quick Button Section</div>
          <div className="mt-3 grid gap-2">
            <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" to="/books">+ Add Book</Link>
            <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" to="/members">+ Add Member</Link>
            <Link className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50" to="/issue">+ Add Borrower</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

