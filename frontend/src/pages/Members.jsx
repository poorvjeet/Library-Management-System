import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  async function loadMembers() {
    const res = await api.get("/members");
    setMembers(res.data.members || []);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function addMember(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/members", { name, memberCode, address, phone });
      setName("");
      setMemberCode("");
      setAddress("");
      setPhone("");
      await loadMembers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add member");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Members</h1>
      <p className="mt-1 text-sm text-slate-600">Manage member records.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <form onSubmit={addMember} className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold">Add Member</div>
          {error ? <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}
          <div className="mt-3 space-y-3">
            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Member ID" value={memberCode} onChange={(e) => setMemberCode(e.target.value)} required />
            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Address / Class" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Add Member</button>
          </div>
        </form>

        <div className="overflow-hidden rounded-lg border bg-white lg:col-span-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-2">{m.name}</td>
                  <td className="px-4 py-2">{m.memberCode}</td>
                  <td className="px-4 py-2">{m.address}</td>
                  <td className="px-4 py-2">{m.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

