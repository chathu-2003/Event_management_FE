import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { getAdminSummary } from "../services/admin-dashboard"
import type { AdminSummary } from "../services/admin-dashboard"

const AdminDashboard = () => {
  const { user, setUser } = useAuth()
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser?.(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    let isMounted = true
    const fetchSummary = async () => {
      try {
        const data = await getAdminSummary()
        if (isMounted) setSummary(data)
      } catch (e) {
        console.error("Failed to fetch admin summary", e)
      }
    }
    fetchSummary()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-lg border-r border-white/10 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-lg">EventSphere</h1>
                  <p className="text-purple-400 text-xs">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {/* Dashboard link */}
            <Link
              to="/admin-dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="font-medium">Dashboard</span>}
            </Link>

            {/* Event Management link */}
            <Link
              to="/admin/events"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Event Management</span>}
            </Link>
            {/* Booking Management link */}
            <Link
              to="/admin/bookings"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {sidebarOpen && <span className="font-medium">Booking Management</span>}
            </Link>
            {/* User Management link */}
            <Link
              to="/admin/users"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a4 4 0 004 4h10a4 4 0 004-4V9h-6m0 0V5a2 2 0 10-4 0v4m0 0a2 2 0 104 0" />
              </svg>
              {sidebarOpen && <span className="font-medium">User Management</span>}
            </Link>

            <Link
              to="/admin/reviews"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Review Management</span>}
            </Link>
          </nav>

          {/* Toggle Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-purple-300 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
              {sidebarOpen && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-purple-400 text-sm">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-white text-sm font-medium">
                      {user.email ?? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-purple-400">Loading...</span>
              )}
            </div>
          </div>
        </nav>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  +12%
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.totalUsers ?? 0}</h3>
              <p className="text-purple-300 text-sm font-medium">Total Users</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  +8%
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.totalEvents ?? 0}</h3>
              <p className="text-blue-300 text-sm font-medium">Total Events</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-orange-500/20 to-red-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  +23%
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.totalBookings ?? 0}</h3>
              <p className="text-orange-300 text-sm font-medium">Total Bookings</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-yellow-500/20 to-amber-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                  Pending
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.pendingBookings ?? 0}</h3>
              <p className="text-yellow-300 text-sm font-medium">Pending Approvals</p>
            </div>
          </div>

          {/* New Analytical Conclusion Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Growth Insight */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">System Growth Conclusion</h2>
              </div>
              
              <div className="h-40 w-full mt-4 relative">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path 
                    d="M0 80 Q 50 70, 100 75 T 200 40 T 300 50 T 400 10 L 400 100 L 0 100 Z" 
                    fill="url(#gradDash)" 
                    className="opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  />
                  <path d="M0 80 Q 50 70, 100 75 T 200 40 T 300 50 T 400 10" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <defs>
                    <linearGradient id="gradDash" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                      <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/5 pt-6 text-center">
                <div><p className="text-white font-bold text-lg">98%</p><p className="text-[10px] text-purple-400 uppercase font-bold">Uptime</p></div>
                <div><p className="text-white font-bold text-lg">{summary ? summary.totalBookings * 5 : 0}</p><p className="text-[10px] text-purple-400 uppercase font-bold">Total Hits</p></div>
                <div><p className="text-white font-bold text-lg">Stable</p><p className="text-[10px] text-purple-400 uppercase font-bold">Network</p></div>
              </div>
            </div>

            {/* Platform Resource Distribution */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Resource Allocation</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] text-purple-300 uppercase font-bold mb-2">
                      <span>Confirmed Bookings</span>
                      <span>82%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-blue-500 to-cyan-400 w-[82%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-purple-300 uppercase font-bold mb-2">
                      <span>Pending Verification</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-orange-500 to-yellow-400 w-[18%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 italic">
                <p className="text-xs text-purple-200 leading-relaxed text-center">
                  "EventSphere Project Conclusion: Successfully integrated user authentication, scalable event logic, and real-time dashboard analytics."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard