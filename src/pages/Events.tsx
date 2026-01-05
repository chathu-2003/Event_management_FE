import { useEffect, useState } from "react"
import Header from "./Header"
import { useAuth } from "../context/authContext"
import { getAllEvents, createEvent, type Event } from "../services/events"

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    location: "",
    price: 0,
    availableSeats: 0,
    category: "",
    image: ""
  })
  const [submitting, setSubmitting] = useState(false)

  // New state for filtering (NO LOGIC CHANGE - just UI state)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getAllEvents()
        setEvents(data)
      } catch (err: any) {
        console.error("Error loading events:", err)
        setError(err?.response?.data?.message || "Failed to load events")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleChange = (field: keyof Event, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user.roles?.includes("ADMIN")) {
      alert("Only admin can add events")
      return
    }
    if (!form.title || !form.date || !form.location || !form.category) {
      alert("Please fill required fields: title, date, location, category")
      return
    }
    if ((form.price ?? 0) < 0 || (form.availableSeats ?? 0) < 0) {
      alert("Price and available seats must be non-negative")
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        title: form.title as string,
        description: (form.description as string) || "",
        date: form.date as string,
        location: form.location as string,
        price: Number(form.price ?? 0),
        availableSeats: Number(form.availableSeats ?? 0),
        category: form.category as string,
        image: (form.image as string) || ""
      }
      const created = await createEvent(payload)
      setEvents(prev => [{ ...(created as Event) }, ...prev])
      setForm({ title: "", description: "", date: "", location: "", price: 0, availableSeats: 0, category: "", image: "" })
      alert("Event created successfully")
    } catch (err: any) {
      console.error("Create event error:", err)
      alert(err?.response?.data?.message || "Failed to create event")
    } finally {
      setSubmitting(false)
    }
  }

  // Filter logic (NO CHANGE TO ORIGINAL LOGIC - just filtering display)
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories from events
  const categories = ["all", ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))]

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase()
    if (lower.includes("tech") || lower.includes("technology")) return "💻"
    if (lower.includes("music") || lower.includes("concert")) return "🎵"
    if (lower.includes("art") || lower.includes("exhibition")) return "🎨"
    if (lower.includes("business") || lower.includes("conference") || lower.includes("summit")) return "💼"
    if (lower.includes("food") || lower.includes("culinary") || lower.includes("dining")) return "🍽️"
    if (lower.includes("sport") || lower.includes("fitness") || lower.includes("game")) return "⚽"
    if (lower.includes("education") || lower.includes("workshop") || lower.includes("training")) return "📚"
    if (lower.includes("health") || lower.includes("wellness") || lower.includes("yoga")) return "🧘"
    if (lower.includes("fashion") || lower.includes("style")) return "👗"
    if (lower.includes("film") || lower.includes("movie") || lower.includes("cinema")) return "🎬"
    if (lower.includes("comedy") || lower.includes("standup")) return "🎭"
    if (lower.includes("gaming") || lower.includes("esports")) return "🎮"
    if (lower.includes("charity") || lower.includes("fundraising") || lower.includes("social")) return "❤️"
    if (lower.includes("science") || lower.includes("research")) return "🔬"
    if (lower.includes("travel") || lower.includes("tourism")) return "✈️"
    if (lower.includes("kids") || lower.includes("children") || lower.includes("family")) return "🎈"
    if (lower.includes("networking") || lower.includes("meetup")) return "🤝"
    if (lower.includes("festival") || lower.includes("celebration")) return "🎊"
    if (lower.includes("outdoor") || lower.includes("adventure") || lower.includes("camping")) return "🏕️"
    if (lower.includes("environment") || lower.includes("sustainability") || lower.includes("green")) return "🌱"
    return "🎉"
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

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              <span className="text-purple-200 text-sm font-medium">Discover Amazing Events</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Explore Our</span><br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Upcoming Events</span>
            </h1>

            <p className="text-xl text-purple-200 max-w-3xl mx-auto">Browse through our curated collection of events and find your next experience</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Bar */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search events by name, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/10 text-purple-300 hover:bg-white/20'
                    }`}
                  >
                    {category === "all" ? "All Events" : `${getCategoryIcon(category)} ${category}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Display */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedCategory === "all" ? "All Events" : `${selectedCategory} Events`}
                <span className="text-purple-400 ml-2">({filteredEvents.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-purple-200">Loading events...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-rose-300 text-lg">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-purple-300">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((ev) => (
                  <div 
                    key={ev._id} 
                    className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center overflow-hidden">
                      {ev.image ? (
                        <img
                          src={ev.image}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-7xl">{getCategoryIcon(ev.category)}</div>
                      )}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium">
                        {ev.category}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {ev.title}
                      </h3>
                      <p className="text-purple-300 text-sm mb-4 line-clamp-2">{ev.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-purple-200 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>

                        <div className="flex items-center text-purple-200 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {ev.location}
                        </div>

                        <div className="flex items-center text-purple-200 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 00-9.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {ev.availableSeats} seats available
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Rs.{ev.price}/=
                          </div>
                          <div className="text-purple-400 text-xs">per person</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-md bg-white/5 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-300 font-medium">© 2025 EventSphere. All rights reserved.</p>
          <p className="text-purple-400/60 text-sm mt-2">Discover your next amazing experience</p>
        </div>
      </footer>
    </div>
  )
}