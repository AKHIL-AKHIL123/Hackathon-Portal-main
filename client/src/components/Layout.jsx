import { Link } from "react-router-dom";

function Layout({ children }) {
  const userRole = localStorage.getItem("userRole") || "guest";
  const userName = localStorage.getItem("userName") || "Guest";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between">
        <span>Welcome, {userName}</span>
        <nav className="space-x-4">
          {userRole === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          {userRole === "coordinator" && <Link to="/coordinator">Coordinator Dashboard</Link>}
          {userRole === "participant" && <Link to="/participant">Participant Dashboard</Link>}
          {userRole === "evaluator" && <Link to="/evaluator">Evaluator Dashboard</Link>}
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
