import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/register", { name, email, password });
      setAuth(res.data);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Register</h1>
      <p className="mt-1 text-sm text-slate-600">Create a new account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-lg border bg-white p-5">
        {error ? <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <p className="mt-1 text-xs text-slate-500">Minimum 6 characters.</p>
        </div>

        <button
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-medium text-slate-900 underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

