import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { getAllReviews, deleteReview, type Review } from "../services/reviews"
import Swal from "sweetalert2"

const AdminReviews = () => {
  const { user, setUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingFilter, setRatingFilter] = useState<"ALL" | "5" | "4" | "3" | "2" | "1">("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser?.(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await getAllReviews()
      setReviews(Array.isArray(data) ? data : [])
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to load reviews.",
        icon: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed) {
      try {
        await deleteReview(reviewId)
        await Swal.fire({
          title: "Deleted!",
          text: "Review has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadReviews()
      } catch (error: any) {
        await Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to delete review.",
          icon: "error"
        })
      }
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesRating = ratingFilter === "ALL" || review.rating === parseInt(ratingFilter)
    
    const eventTitle = typeof review.eventId === 'object' ? review.eventId.title : "Unknown Event"
    const userEmail = typeof review.userId === 'object' ? review.userId.email : review.userName || "Unknown User"
    
    const matchesSearch = 
      eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRating && matchesSearch
  })

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-400"
    if (rating >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const getEventTitle = (eventId: string | { _id: string; title: string }) => {
    return typeof eventId === 'object' ? eventId.title : "Unknown Event"
  }

  const getUserEmail = (userId: string | { _id: string; email: string }, userName?: string) => {
    if (typeof userId === 'object') return userId.email
    return userName || "Unknown User"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {sidebarOpen && <span className="font-medium">User Management</span>}
            </Link>

            <Link
              to="/admin/reviews"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Review Management</span>}
            </Link>
          </nav>

          {/* Sidebar Toggle */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              {sidebarOpen && <span className="font-medium">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-white/10 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Review Management</h1>
              <p className="text-purple-400 text-sm">Manage and moderate user reviews</p>
            </div>
            <div className="flex items-center gap-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.email?.[0]?.toUpperCase()}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">{user?.email}</p>
                  <p className="text-purple-400 text-xs">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{reviews.length}</p>
              <p className="text-purple-400 text-sm">Total Reviews</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
              </p>
              <p className="text-purple-400 text-sm">Average Rating</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {reviews.filter(r => r.rating >= 4).length}
              </p>
              <p className="text-purple-400 text-sm">Positive Reviews</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                {reviews.filter(r => r.rating <= 2).length}
              </p>
              <p className="text-purple-400 text-sm">Negative Reviews</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by event, user, or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Filter by Rating</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="ALL" className="bg-gray-900">All Ratings</option>
                  <option value="5" className="bg-gray-900">⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value="4" className="bg-gray-900">⭐⭐⭐⭐ (4 Stars)</option>
                  <option value="3" className="bg-gray-900">⭐⭐⭐ (3 Stars)</option>
                  <option value="2" className="bg-gray-900">⭐⭐ (2 Stars)</option>
                  <option value="1" className="bg-gray-900">⭐ (1 Star)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No reviews found.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Comment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredReviews.map((review) => (
                      <tr key={review._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{getEventTitle(review.eventId)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-purple-300 text-sm">{getUserEmail(review.userId, review.userName)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-lg font-bold ${getRatingColor(review.rating)}`}>
                            {getRatingStars(review.rating)}
                          </div>
                          <p className="text-gray-400 text-xs">{review.rating}/5</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-300 text-sm line-clamp-2 max-w-md">{review.comment}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-400 text-sm">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })
                              : "N/A"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(review._id || "")}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminReviews
