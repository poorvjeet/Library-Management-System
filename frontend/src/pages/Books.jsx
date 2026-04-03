import { useEffect, useState } from "react";
import { api } from "../lib/api";
import BookList from "../components/BookList";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [total, setTotal] = useState(1);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();

  async function loadBooks(search) {
    setLoading(true);
    try {
      const res = await api.get("/books", { params: search ? { q: search } : {} });
      setBooks(res.data.books || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks("");
  }, []);

  async function addBook(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/books", { title, category, author, coverUrl, total, price });
      setTitle("");
      setCategory("");
      setAuthor("");
      setCoverUrl("");
      setTotal(1);
      setPrice(0);
      await loadBooks(q);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add book");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Books</h1>
          <p className="mt-1 text-sm text-slate-600">Add and view books.</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded-md border px-3 py-2 text-sm ${viewMode === "gallery" ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}
            onClick={() => setViewMode("gallery")}
            type="button"
          >
            Gallery
          </button>
          <button
            className={`rounded-md border px-3 py-2 text-sm ${viewMode === "table" ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}
            onClick={() => setViewMode("table")}
            type="button"
          >
            Table
          </button>
          <input
            className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200 sm:w-72"
            placeholder="Search by title/author..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50"
            onClick={() => loadBooks(q)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <form onSubmit={addBook} className="rounded-lg border bg-white p-4 lg:col-span-1">
          <div className="text-sm font-semibold">Add Book</div>
          {error ? <div className="mt-3 rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</div> : null}

          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Author</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cover URL (optional)</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Book Total</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                type="number"
                min="0"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>
            <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">
              Add
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="rounded-lg border bg-white p-4 text-slate-600">Loading...</div>
          ) : viewMode === "gallery" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {books.map((b) => (
                <div key={b.id} className="rounded-lg border bg-white p-3">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.title} className="mb-3 h-36 w-full rounded object-cover" />
                  ) : (
                    <div className="mb-3 h-36 w-full rounded bg-slate-100" />
                  )}
                  <div className="font-medium">{b.title}</div>
                  <div className="text-sm text-slate-600">{b.author}</div>
                  <div className="mt-1 text-xs text-slate-500">{b.category}</div>
                  <div className="mt-2 text-sm">
                    Stock: {b.amountInStock}/{b.total}
                  </div>
                  <div className="text-sm">Rs. {b.price}</div>
                  <button
                    className="mt-3 w-full rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                    disabled={b.amountInStock <= 0}
                    onClick={() => navigate("/issue", { state: { book: b } })}
                  >
                    Issue
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <BookList
              books={books}
              onIssueClick={(book) => navigate("/issue", { state: { book } })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

