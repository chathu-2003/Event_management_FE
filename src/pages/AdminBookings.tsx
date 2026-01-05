import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { getAllBookings, approveBooking, declineBooking, type BookingWithDetails } from "../services/admin-bookings"
import Swal from "sweetalert2"

const AdminBookings = () => {
  const { user, setUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL")

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser?.(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await getAllBookings()
      setBookings(data)
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to load bookings.",
        icon: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Approve Booking?",
      text: "This will confirm the booking for the customer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve it!"
    })

    if (result.isConfirmed) {
      try {
        await approveBooking(bookingId)
        await Swal.fire({
          title: "Approved!",
          text: "Booking has been approved.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadBookings()
      } catch (error: any) {
        await Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to approve booking.",
          icon: "error"
        })
      }
    }
  }

  const handleDecline = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Decline Booking?",
      text: "This will cancel the booking and refund seats.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, decline it!"
    })

    if (result.isConfirmed) {
      try {
        await declineBooking(bookingId)
        await Swal.fire({
          title: "Declined!",
          text: "Booking has been cancelled.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadBookings()
      } catch (error: any) {
        await Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to decline booking.",
          icon: "error"
        })
      }
    }
  }

  const filteredBookings = bookings.filter(b => filter === "ALL" || b.status === filter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600/80 text-yellow-100"
      case "CONFIRMED":
        return "bg-green-600/80 text-green-100"
      case "CANCELLED":
        return "bg-red-600/80 text-red-100"
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
            <Link
              to="/admin-dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="font-medium">Dashboard</span>}
            </Link>

            <Link
              to="/admin/events"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Event Management</span>}
            </Link>

            <Link
              to="/admin/bookings"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {sidebarOpen && <span className="font-medium">Booking Management</span>}
            </Link>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a4 4 0 004 4h10a4 4 0 004-4V9h-6m0 0V5a2 2 0 10-4 0v4m0 0a2 2 0 104 0" />
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
                Booking Management
              </h1>
              <p className="text-purple-400 text-sm">Review and manage customer bookings</p>
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
          <div className="mb-6 flex gap-3">
            {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 rounded-xl font-medium transition-all ${
                  filter === status
                    ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white/5 text-purple-300 hover:bg-white/10"
                }`}
              >
                {status} ({bookings.filter(b => status === "ALL" || b.status === status).length})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-purple-300">
              No bookings found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Event Image */}
                      {booking.eventId?.image ? (
                        <img 
                          src={booking.eventId.image} 
                          alt={booking.eventId.title}
                          className="w-24 h-24 object-cover rounded-xl shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-linear-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center shrink-0">
                          <svg className="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-bold text-xl">{booking.eventId?.title || "Event"}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="text-purple-200">
                            <span className="text-purple-400">Customer:</span> {booking.customerName}
                          </div>
                          <div className="text-purple-200">
                            <span className="text-purple-400">Email:</span> {booking.customerEmail}
                          </div>
                          <div className="text-purple-200">
                            <span className="text-purple-400">Tickets:</span> {booking.numberOfTickets}
                          </div>
                          <div className="text-purple-200">
                            <span className="text-purple-400">Total:</span> Rs.{booking.totalPrice}
                          </div>
                          <div className="text-purple-200">
                            <span className="text-purple-400">Event Date:</span> {new Date(booking.eventId?.date).toLocaleDateString()}
                          </div>
                          <div className="text-purple-200">
                            <span className="text-purple-400">Booked On:</span> {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {booking.eventId?.location && (
                          <p className="text-purple-300 text-sm mt-2">
                            📍 {booking.eventId.location}
                          </p>
                        )}

                        {/* Admin Action Info */}
                        {booking.status === "CONFIRMED" && booking.approvedBy && (
                          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-green-300">
                            <span className="text-green-400">✓ Approved by:</span> {booking.approvedBy.adminName} on {new Date(booking.approvedBy.approvedAt).toLocaleString()}
                          </div>
                        )}
                        {booking.status === "CANCELLED" && booking.declinedBy && (
                          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-red-300">
                            <span className="text-red-400">✕ Declined by:</span> {booking.declinedBy.adminName} on {new Date(booking.declinedBy.declinedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {booking.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(booking._id)}
                            className="px-5 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-xl font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecline(booking._id)}
                            className="px-5 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-medium flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleDecline(booking._id)}
                          className="px-5 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-medium flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}
                      {booking.status === "CANCELLED" && (
                        <div className="text-red-300 text-sm italic">Cancelled</div>
                      )}
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

export default AdminBookings
