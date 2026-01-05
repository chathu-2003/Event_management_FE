import { useEffect, useMemo, useState } from "react"
import Header from "./Header"
import { getAllEvents, type Event } from "../services/events"
import { createBooking } from "../services/bookings"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export default function Bookings() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Booking form state
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [customerEmail, setCustomerEmail] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [specialRequests, setSpecialRequests] = useState<string>("")
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [numberOfTickets, setNumberOfTickets] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)

  // Fetch events (with graceful fallback to empty list)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllEvents()
        setEvents(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Error fetching events:", err)
        setError(err?.response?.data?.message || "Failed to load events")
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const selectedEvent = useMemo(() => {
    return events.find(e => e._id === selectedEventId) || null
  }, [events, selectedEventId])

  const totalPrice = useMemo(() => {
    return selectedEvent ? selectedEvent.price * numberOfTickets : 0
  }, [selectedEvent, numberOfTickets])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      await Swal.fire({
        title: "Login required",
        text: "Please login to place a booking",
        icon: "info"
      })
      navigate("/login")
      return
    }

    if (!selectedEventId) {
      await Swal.fire({
        title: "Select an event",
        icon: "warning"
      })
      return
    }
    if (!customerName.trim()) {
      await Swal.fire({
        title: "Name required",
        icon: "warning"
      })
      return
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      await Swal.fire({
        title: "Invalid email",
        icon: "warning"
      })
      return
    }
    if (!phoneNumber.trim()) {
      await Swal.fire({
        title: "Phone required",
        icon: "warning"
      })
      return
    }
    if (numberOfTickets < 1) {
      await Swal.fire({
        title: "Minimum 1 ticket",
        icon: "warning"
      })
      return
    }
    if (selectedEvent && numberOfTickets > selectedEvent.availableSeats) {
      await Swal.fire({
        title: "Not enough seats",
        text: `Only ${selectedEvent.availableSeats} seats available`,
        icon: "warning"
      })
      return
    }
    if (!acceptTerms) {
      await Swal.fire({
        title: "Accept terms",
        text: "Please accept the terms and conditions",
        icon: "warning"
      })
      return
    }

    try {
      setSubmitting(true)
      await createBooking({
        eventId: selectedEventId,
        numberOfTickets,
        customerName,
        customerEmail,
      })

      await Swal.fire({
        title: "Booking Confirmed!",
        icon: "success",
        html:
          `<div style="text-align:left;">` +
          `<p><strong>Event:</strong> ${selectedEvent?.title ?? ""}</p>` +
          `<p><strong>Name:</strong> ${customerName}</p>` +
          `<p><strong>Email:</strong> ${customerEmail}</p>` +
          `<p><strong>Phone:</strong> ${phoneNumber}</p>` +
          `<p><strong>Tickets:</strong> ${numberOfTickets}</p>` +
          `<p><strong>Total:</strong> ${totalPrice}</p>` +
          (specialRequests.trim() ? `<p><strong>Notes:</strong> ${specialRequests}</p>` : "") +
          `</div>`,
        confirmButtonText: "Great!"
      })

      // Reset form
      setSelectedEventId("")
      setCustomerName("")
      setCustomerEmail("")
      setPhoneNumber("")
      setSpecialRequests("")
      setAcceptTerms(false)
      setNumberOfTickets(1)
    } catch (err: any) {
      console.error("Booking error:", err)
      await Swal.fire({
        title: "Booking failed",
        text: err?.response?.data?.message || err?.message || "Failed to create booking. Please try again.",
        icon: "error"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const lower = category?.toLowerCase() || ""
    if (lower.includes("tech") || lower.includes("technology")) return "💻"
    if (lower.includes("music") || lower.includes("concert")) return "🎵"
    if (lower.includes("art") || lower.includes("exhibition")) return "🎨"
    if (lower.includes("business") || lower.includes("conference")) return "💼"
    if (lower.includes("food") || lower.includes("culinary")) return "🍽️"
    if (lower.includes("sport") || lower.includes("fitness")) return "⚽"
    if (lower.includes("education") || lower.includes("workshop")) return "📚"
    return "🎉"
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
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
            <span className="text-purple-200 text-sm font-medium">Secure Your Spot • Fast Booking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">Book Your</span><br />
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Next Experience</span>
          </h1>

          <p className="text-xl text-purple-200 max-w-3xl mx-auto">Choose an event, enter your details, and confirm your booking in minutes</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Booking Form */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Booking Details</h2>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-200">Loading available events...</p>
                  </div>
                )}

                {error && (
                  <div className="backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {!loading && (
                  <div className="space-y-6">
                    {/* Event Selector */}
                    <div>
                      <label className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Select Event *
                      </label>
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                      >
                        {events.length === 0 ? (
                          <option value="" disabled className="bg-gray-900">No events available</option>
                        ) : (
                          <>
                            <option value="" className="bg-gray-900">-- Choose an event --</option>
                            {events.map(ev => (
                              <option key={ev._id} value={ev._id} className="bg-gray-900">
                                {getCategoryIcon(ev.category)} {ev.title} • {new Date(ev.date).toLocaleDateString()}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {events.length === 0 && !loading && (
                        <p className="text-purple-300 text-xs mt-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          No events loaded yet. Please check back later.
                        </p>
                      )}
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 0771234567"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                      />
                    </div>

                    {/* Number of Tickets */}
                    <div>
                      <label className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Number of Tickets *
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNumberOfTickets(t => Math.max(1, t - 1))}
                          className="w-12 h-12 bg-white/5 border border-white/20 rounded-xl text-purple-300 hover:bg-white/10 transition-all font-bold text-xl flex items-center justify-center"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={selectedEvent?.availableSeats || 999}
                          value={numberOfTickets}
                          onChange={(e) => setNumberOfTickets(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setNumberOfTickets(t => Math.min((selectedEvent?.availableSeats || t + 1), t + 1))}
                          className="w-12 h-12 bg-white/5 border border-white/20 rounded-xl text-purple-300 hover:bg-white/10 transition-all font-bold text-xl flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      {selectedEvent && (
                        <p className="text-purple-400 text-xs mt-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {selectedEvent.availableSeats} seats available
                        </p>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Special Requests (optional)
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any notes, seating preferences, or accessibility needs..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition-all"
                      />
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                      <input
                        id="acceptTerms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-400"
                      />
                      <label htmlFor="acceptTerms" className="text-purple-200 text-sm">
                        I agree to the event's <span className="text-purple-400 underline cursor-pointer">terms and conditions</span>, refund policy, and code of conduct.
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEventId("")
                          setCustomerName("")
                          setCustomerEmail("")
                          setPhoneNumber("")
                          setSpecialRequests("")
                          setAcceptTerms(false)
                          setNumberOfTickets(1)
                        }}
                        className="flex-1 px-6 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
                      >
                        Clear Form
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 px-6 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-60 hover:shadow-lg hover:shadow-purple-500/50"
                      >
                        {submitting ? "Processing..." : "✨ Confirm Booking"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Booking Summary
                </h3>

                {selectedEvent ? (
                  <div className="space-y-4">
                    {/* Event Info */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-4xl mb-3 text-center">{getCategoryIcon(selectedEvent.category)}</div>
                      <h4 className="text-white font-bold text-lg mb-2 text-center">{selectedEvent.title}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-purple-200">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center text-purple-200">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {selectedEvent.location}
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-purple-200">
                        <span>Price per ticket:</span>
                        <span className="font-semibold text-white">Rs.{selectedEvent.price}/=</span>
                      </div>
                      <div className="flex justify-between items-center text-purple-200">
                        <span>Number of tickets:</span>
                        <span className="font-semibold text-white">{numberOfTickets}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                        <span className="text-purple-200 font-semibold">Total Amount:</span>
                        <span className="text-3xl font-black bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Rs.{totalPrice}/=</span>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-purple-200 text-xs">You'll receive a confirmation email after booking. Please arrive 15 minutes before the event.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🎫</div>
                    <p className="text-purple-300 text-sm">Select an event to see booking details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-md bg-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-300 font-medium">© 2025 EventSphere. All rights reserved.</p>
          <p className="text-purple-400/60 text-sm mt-2">Secure and easy event booking</p>
        </div>
      </footer>
    </div>
  )
}