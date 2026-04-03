import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import IssueReturn from "./pages/IssueReturn";
import Members from "./pages/Members";
import Borrowers from "./pages/Borrowers";

function HomeLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-4">
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50" to="/">
            Dashboard
          </Link>
          <Link className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50" to="/books">
            Books
          </Link>
          <Link className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50" to="/issue">
            Add Borrower
          </Link>
          <Link className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50" to="/members">
            Members
          </Link>
          <Link className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50" to="/borrowers">
            Borrowers
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomeLayout>
              <Dashboard />
            </HomeLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <HomeLayout>
              <Books />
            </HomeLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/issue"
        element={
          <ProtectedRoute>
            <HomeLayout>
              <IssueReturn />
            </HomeLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <HomeLayout>
              <Members />
            </HomeLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrowers"
        element={
          <ProtectedRoute>
            <HomeLayout>
              <Borrowers />
            </HomeLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<><Navbar /><Login /></>} />
      <Route path="/register" element={<><Navbar /><Register /></>} />
    </Routes>
  );
}

