import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { getAllUsers, updateUser, deleteUser, type User } from "../services/admin-users"
import Swal from "sweetalert2"

const AdminUsers = () => {
  const { user, setUser } = useAuth()
  const [sidebarOpen] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "ADMIN" | "AUTHOR" | "USER">("ALL")
  const [approvalFilter, setApprovalFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "NONE">("ALL")

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser?.(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to load users.",
        icon: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    const result = await Swal.fire({
      title: "Change Role?",
      text: `Change user role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, change it!"
    })

    if (result.isConfirmed) {
      try {
        await updateUser(userId, { roles: [newRole] })
        await Swal.fire({
          title: "Success!",
          text: "User role updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadUsers()
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to update user role.",
          icon: "error"
        })
      }
    }
  }

  const handleApprove = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED"
    const result = await Swal.fire({
      title: `${newStatus} User?`,
      text: `This will ${newStatus.toLowerCase()} the user account.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: currentStatus === "APPROVED" ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${newStatus.toLowerCase()} it!`
    })

    if (result.isConfirmed) {
      try {
        await updateUser(userId, { approved: newStatus })
        await Swal.fire({
          title: "Success!",
          text: `User ${newStatus.toLowerCase()} successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadUsers()
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to update user status.",
          icon: "error"
        })
      }
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: `This will permanently delete ${userName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed) {
      try {
        await deleteUser(userId)
        await Swal.fire({
          title: "Deleted!",
          text: "User deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadUsers()
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete user.",
          icon: "error"
        })
      }
    }
  }

  const filteredUsers = users.filter(u => {
    const roleMatch = filter === "ALL" || u.roles.includes(filter)
    const approvalMatch = approvalFilter === "ALL" || u.approved === approvalFilter
    return roleMatch && approvalMatch
  })

  const getRoleBadge = (roles: string[]) => {
    const role = roles[0]
    switch (role) {
      case "ADMIN":
        return "bg-red-600/80 text-red-100"
      case "AUTHOR":
        return "bg-purple-600/80 text-purple-100"
      case "USER":
        return "bg-blue-600/80 text-blue-100"
      default:
        return "bg-gray-600/80 text-gray-100"
    }
  }

  const getApprovalBadge = (approved: string) => {
    switch (approved) {
      case "APPROVED":
        return "bg-green-600/80 text-green-100"
      case "REJECTED":
        return "bg-red-600/80 text-red-100"
      case "PENDING":
        return "bg-yellow-600/80 text-yellow-100"
      case "NONE":
        return "bg-gray-600/80 text-gray-100"
      default:
        return "bg-gray-600/80 text-gray-100"
    }
  }

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a4 4 0 004 4h10a4 4 0 004-4V9h-6m0 0V5a2 2 0 10-4 0v4m0 0a2 2 0 104 0" />
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Admin Dashboard</span>}
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="font-medium">User Management</span>}
            </Link>

            <Link
              to="/admin/reviews"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a4 4 0 004 4h10a4 4 0 004-4V9h-6m0 0V5a2 2 0 10-4 0v4m0 0a2 2 0 104 0" />
              </svg>
              {sidebarOpen && <span className="font-medium">Review Management</span>}
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-all"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span>Logout</span>}
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
                User Management
              </h1>
              <p className="text-purple-400 text-sm">Manage system users and permissions</p>
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

        {/* Content */}
        <div className="p-8">
          {/* Filter Tabs */}
          <div className="mb-6 flex gap-3 flex-wrap">
            <div className="flex gap-2 items-center">
              <span className="text-purple-300 text-sm font-medium">Role:</span>
              {(["ALL", "ADMIN", "AUTHOR", "USER"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setFilter(role)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                    filter === role
                      ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-purple-300 text-sm font-medium">Status:</span>
              {(["ALL", "PENDING", "APPROVED", "REJECTED", "NONE"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setApprovalFilter(status)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                    approvalFilter === status
                      ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-purple-300">
              No users found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((userItem) => (
                <div key={userItem._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between gap-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-linear-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a4 4 0 004 4h10a4 4 0 004-4V9h-6m0 0V5a2 2 0 10-4 0v4m0 0a2 2 0 104 0" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl">{userItem.firstname} {userItem.lastname}</h3>
                        <p className="text-purple-300 text-sm">{userItem.email}</p>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(userItem.roles)}`}>
                            {userItem.roles[0]}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getApprovalBadge(userItem.approved)}`}>
                            {userItem.approved}
                          </span>
                          <span className="text-purple-300 text-xs">
                            Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {/* Role Dropdown */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleChangeRole(userItem._id, "ADMIN")}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            userItem.roles.includes("ADMIN")
                              ? "bg-red-600 text-white"
                              : "bg-gray-600/50 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => handleChangeRole(userItem._id, "AUTHOR")}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            userItem.roles.includes("AUTHOR")
                              ? "bg-purple-600 text-white"
                              : "bg-gray-600/50 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          Author
                        </button>
                        <button
                          onClick={() => handleChangeRole(userItem._id, "USER")}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            userItem.roles.includes("USER")
                              ? "bg-blue-600 text-white"
                              : "bg-gray-600/50 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          User
                        </button>
                      </div>

                      {/* Approve/Reject Button */}
                      <button
                        onClick={() => handleApprove(userItem._id, userItem.approved)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                          userItem.approved === "APPROVED"
                            ? "bg-red-600/80 hover:bg-red-600 text-white"
                            : "bg-green-600/80 hover:bg-green-600 text-white"
                        }`}
                      >
                        {userItem.approved === "APPROVED" ? "Reject" : "Approve"}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(userItem._id, `${userItem.firstname} ${userItem.lastname}`)}
                        className="px-4 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminUsers
