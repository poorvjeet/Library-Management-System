export default function BookList({ books, onIssueClick }) {
  if (!books?.length) {
    return <div className="rounded-lg border bg-white p-4 text-slate-600">No books found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-2">Cover</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="px-4 py-2">
                {b.coverUrl ? (
                  <img src={b.coverUrl} alt={b.title} className="h-10 w-8 rounded object-cover" />
                ) : (
                  <div className="h-10 w-8 rounded bg-slate-100" />
                )}
              </td>
              <td className="px-4 py-2 font-medium">{b.title}</td>
              <td className="px-4 py-2">{b.category}</td>
              <td className="px-4 py-2">{b.author}</td>
              <td className="px-4 py-2">
                {b.amountInStock}/{b.total}
              </td>
              <td className="px-4 py-2">Rs. {b.price}</td>
              <td className="px-4 py-2">{b.status}</td>
              <td className="px-4 py-2">
                <button
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                  disabled={b.amountInStock <= 0}
                  onClick={() => onIssueClick?.(b)}
                >
                  Issue
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

