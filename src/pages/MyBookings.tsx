import { useEffect, useState } from "react"
import Header from "./Header"
import { getMyBookings, cancelMyBooking, type MyBooking } from "../services/mybookings"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState<MyBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if not logged in after auth check completes
    if (!authLoading && !user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to view your bookings",
        icon: "info"
      }).then(() => {
        navigate("/login")
      })
      return
    }

    if (user) {
      fetchMyBookings()
    }
  }, [user, authLoading, navigate])

  const fetchMyBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyBookings()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error("Error fetching my bookings:", err)
      setError(err?.response?.data?.message || "Failed to load your bookings")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Are you sure you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      background: '#1f2937',
      color: '#e9d5ff'
    })

    if (result.isConfirmed) {
      try {
        await cancelMyBooking(bookingId)
        await Swal.fire({
          title: "Cancelled!",
          text: "Your booking has been cancelled.",
          icon: "success",
          background: '#1f2937',
          color: '#e9d5ff'
        })
        fetchMyBookings() // Refresh the list
      } catch (err: any) {
        await Swal.fire({
          title: "Error",
          text: err?.response?.data?.message || "Failed to cancel booking",
          icon: "error",
          background: '#1f2937',
          color: '#e9d5ff'
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300'
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300'
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-300'
      default:
        return 'bg-white/10 border border-white/20 text-purple-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    const lower = category?.toLowerCase() || ''
    if (lower.includes("tech") || lower.includes("technology")) return "💻"
    if (lower.includes("music") || lower.includes("concert")) return "🎵"
    if (lower.includes("art") || lower.includes("exhibition")) return "🎨"
    if (lower.includes("business") || lower.includes("conference") || lower.includes("summit")) return "💼"
    if (lower.includes("food") || lower.includes("culinary")) return "🍽️"
    if (lower.includes("sport") || lower.includes("fitness")) return "⚽"
    return "🎉"
  }

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not logged in (redirect will happen in useEffect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
            <span className="text-purple-200 text-sm font-medium">Your Personal Booking Dashboard</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">My Event</span><br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Bookings</span>
          </h1>

          <p className="text-xl text-purple-200 max-w-3xl mx-auto">View and manage all your event bookings in one place</p>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-20">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-purple-200 text-lg">Loading your bookings...</p>
              </div>
            </div>
          ) : error ? (
            <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-2">Error Loading Bookings</h3>
                <p className="text-rose-300 text-lg">{error}</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-20">
              <div className="text-center">
                <div className="text-8xl mb-6">🎫</div>
                <h3 className="text-3xl font-bold text-white mb-4">No Bookings Yet</h3>
                <p className="text-purple-300 text-lg mb-8">You haven't made any event bookings. Start exploring amazing events!</p>
                <button
                  onClick={() => navigate("/events")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Browse Events
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all hover:scale-[1.02]"
                >
                  <div className="md:flex">
                    {/* Event Image */}
                    <div className="md:w-1/3 relative overflow-hidden">
                      {(booking.eventId?.imageUrl || booking.eventId?.image) ? (
                        <img
                          src={booking.eventId.imageUrl || booking.eventId.image}
                          alt={booking.eventId.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center"><div class="text-9xl">${getCategoryIcon(booking.eventId?.category || '')}</div></div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center h-64">
                          <div className="text-9xl">{getCategoryIcon(booking.eventId?.category || '')}</div>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="p-8 md:w-2/3">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-3xl font-black text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {booking.eventId?.title || 'Event'}
                          </h2>
                          <p className="text-purple-400 text-sm">
                            Booking ID: {booking._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(booking.status)} backdrop-blur-md`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      {booking.eventId?.description && (
                        <p className="text-purple-200 mb-6 leading-relaxed line-clamp-2">
                          {booking.eventId.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center text-purple-300 text-sm mb-1">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Event Date
                          </div>
                          <p className="font-bold text-white">
                            {booking.eventId?.date ? formatDate(booking.eventId.date) : 'TBA'}
                          </p>
                        </div>

                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center text-purple-300 text-sm mb-1">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Location
                          </div>
                          <p className="font-bold text-white">
                            {booking.eventId?.location || 'Online Event'}
                          </p>
                        </div>

                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center text-purple-300 text-sm mb-1">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            Tickets
                          </div>
                          <p className="font-bold text-white">
                            {booking.numberOfTickets} {booking.numberOfTickets === 1 ? 'Ticket' : 'Tickets'}
                          </p>
                        </div>

                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center text-purple-300 text-sm mb-1">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Customer
                          </div>
                          <p className="font-bold text-white">
                            {booking.customerName}
                          </p>
                        </div>

                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center text-purple-300 text-sm mb-1">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </div>
                          <p className="font-bold text-white text-sm">
                            {booking.customerEmail}
                          </p>
                        </div>

                        <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center text-purple-300 text-sm mb-1">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Total Price
                          </div>
                          <p className="font-bold text-transparent bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-xl">
                            Rs.{booking.totalPrice.toFixed(2)}/=
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-purple-400 text-sm mb-6 bg-white/5 rounded-lg p-3">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Booked on {formatDate(booking.bookingDate || booking.createdAt)}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {booking.status.toLowerCase() !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <button
                          onClick={() => navigate("/events")}
                          className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                        >
                          Browse More Events
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-md bg-white/5 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-300 font-medium">© 2025 EventSphere. All rights reserved.</p>
          <p className="text-purple-400/60 text-sm mt-2">Manage your events with confidence</p>
        </div>
      </footer>
    </div>
  )
}
