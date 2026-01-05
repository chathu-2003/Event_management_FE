import { useEffect, useState } from "react"
import Header from "./Header"
import { useAuth } from "../context/authContext"
import { getAllEvents, type Event } from "../services/events"
import { createReview, getAllReviews, updateReview, deleteReview, type Review } from "../services/reviews"

interface ReviewForm {
  eventId: string
  rating: number
  comment: string
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState<ReviewForm>({
    eventId: "",
    rating: 5,
    comment: ""
  })

  // Load events and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const eventsData = await getAllEvents()
        const reviewsData = await getAllReviews()
        
        // Ensure events data is array
        const eventsList = Array.isArray(eventsData) ? eventsData : []
        const reviewsList = Array.isArray(reviewsData) ? reviewsData : []
        
        console.log("Events loaded:", eventsList.length, eventsList)
        console.log("Reviews loaded:", reviewsList.length, reviewsList)
        
        setEvents(eventsList)
        setReviews(reviewsList)
      } catch (err: any) {
        console.error("Error loading data:", err)
        setError(err?.response?.data?.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (field: keyof ReviewForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Please login to add a review")
      return
    }

    if (!form.eventId) {
      alert("Please select an event")
      return
    }

    if (!form.comment || (form.comment as string).trim().length < 10) {
      alert("Please enter a review comment (minimum 10 characters)")
      return
    }

    if ((form.rating ?? 0) < 1 || (form.rating ?? 0) > 5) {
      alert("Rating must be between 1 and 5")
      return
    }

    try {
      setSubmitting(true)

      if (editingId) {
        await updateReview(editingId, {
          rating: form.rating as number,
          comment: form.comment as string
        })
        setReviews(prev =>
          prev.map(r =>
            r._id === editingId
              ? { ...r, rating: form.rating as number, comment: form.comment as string }
              : r
          )
        )
        alert("Review updated successfully")
        setEditingId(null)
      } else {
        const newReview = await createReview({
          eventId: form.eventId as string,
          userId: user._id || user.id || "",
          userName: user.username || user.email || "Anonymous",
          rating: form.rating as number,
          comment: form.comment as string
        })
        setReviews(prev => [newReview, ...prev])
        alert("Review added successfully")
      }

      setForm({ eventId: "", rating: 5, comment: "" })
    } catch (err: any) {
      console.error("Error submitting review:", err)
      alert(err?.response?.data?.message || "Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (review: Review) => {
    setEditingId(review._id || "")
    // Extract eventId as string (in case it's populated as object)
    const eventIdString = typeof review.eventId === 'string' ? review.eventId : (review.eventId as any)?._id || ""
    setForm({
      eventId: eventIdString,
      rating: review.rating,
      comment: review.comment
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId)
        setReviews(prev => prev.filter(r => r._id !== reviewId))
        alert("Review deleted successfully")
      } catch (err: any) {
        console.error("Error deleting review:", err)
        alert(err?.response?.data?.message || "Failed to delete review")
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ eventId: "", rating: 5, comment: "" })
  }

  // Sort reviews by newest first
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-400"
    if (rating >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></span>
              <span className="text-indigo-200 text-sm font-medium">Share Your Experience</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-linear-to-r from-white to-indigo-200 bg-clip-text text-transparent">Event Reviews</span><br />
              <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Your Voice Matters</span>
            </h1>

            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">Help others discover amazing events by sharing your honest reviews and ratings.</p>
          </div>
        </div>
      </section>

      {/* Add/Edit Review Form */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-linear-to-br from-indigo-500/20 to-cyan-500/20 border border-white/20 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              {editingId ? "Edit Your Review" : "Share Your Review"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Select Event <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.eventId || ""}
                    onChange={(e) => handleChange("eventId", e.target.value)}
                    disabled={!!editingId}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option key="empty" value="">Choose an event...</option>
                    {events.map(event => (
                      <option key={event._id?.toString() || event._id} value={event._id?.toString() || event._id} className="bg-gray-900">
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Rating <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.rating || 5}
                    onChange={(e) => handleChange("rating", parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="5" className="bg-gray-900">⭐⭐⭐⭐⭐ Excellent (5)</option>
                    <option value="4" className="bg-gray-900">⭐⭐⭐⭐ Very Good (4)</option>
                    <option value="3" className="bg-gray-900">⭐⭐⭐ Good (3)</option>
                    <option value="2" className="bg-gray-900">⭐⭐ Fair (2)</option>
                    <option value="1" className="bg-gray-900">⭐ Poor (1)</option>
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Your Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.comment || ""}
                  onChange={(e) => handleChange("comment", e.target.value)}
                  placeholder="Share your experience with this event... (minimum 10 characters)"
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                ></textarea>
                <p className="text-gray-400 text-sm mt-2">
                  {(form.comment as string)?.length || 0} characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Submitting..." : editingId ? "Update Review" : "Submit Review"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <section className="py-6 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {error}
            </div>
          </div>
        </section>
      )}

      {/* Reviews List */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {sortedReviews.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              sortedReviews.map(review => {
                // Get event title - either from populated data or find in events list
                let eventTitle = "Unknown Event"
                if (typeof review.eventId === 'object' && review.eventId?.title) {
                  eventTitle = review.eventId.title
                } else if (typeof review.eventId === 'string') {
                  const event = events.find(e => e._id === review.eventId)
                  eventTitle = event?.title || "Unknown Event"
                }
                
                return (
                  <div
                    key={review._id}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{eventTitle}</h3>
                        <p className="text-indigo-300 text-sm mb-3">
                          by <span className="font-semibold">{review.userName || "Anonymous"}</span>
                        </p>
                        <div className={`text-2xl font-bold ${getRatingColor(review.rating)}`}>
                          {getRatingStars(review.rating)}
                        </div>
                      </div>

                      {user && (
                        // Extract userId as string (in case it's populated as object)
                        user._id === (typeof review.userId === 'string' ? review.userId : (review.userId as any)?._id) ||
                        user.id === (typeof review.userId === 'string' ? review.userId : (review.userId as any)?._id) ||
                        user?.roles?.includes("ADMIN")
                      ) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/50 rounded-lg transition-all text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id || "")}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 rounded-lg transition-all text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <p className="text-gray-500 text-sm">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                          : "Date unavailable"
                        }
                      </p>
                      {review.updatedAt && review.updatedAt !== review.createdAt && (
                        <p className="text-gray-500 text-sm italic">Edited</p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      {reviews.length > 0 && (
        <section className="py-12 px-6 bg-white/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Reviews Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-indigo-400 mb-2">{reviews.length}</div>
                <div className="text-gray-300">Total Reviews</div>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </div>
                <div className="text-gray-300">Average Rating</div>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {reviews.filter(r => r.rating >= 4).length}
                </div>
                <div className="text-gray-300">5-Star Reviews</div>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {new Set(reviews.map(r => r.eventId)).size}
                </div>
                <div className="text-gray-300">Events Reviewed</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
