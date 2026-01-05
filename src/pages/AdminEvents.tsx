import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import type { ChangeEvent } from "react"
import type { Event } from "../services/events"
import { getAdminEvents, createEvent, updateEvent, deleteEvent } from "../services/admin-events"
import Swal from "sweetalert2"

const emptyForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  price: "",
  availableSeats: "",
  category: "",
}

const AdminEvents = () => {
  const { user, setUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState<any>(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser?.(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    const data = await getAdminEvents()
    setEvents(data)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setImage(null)
    setImagePreview(null)
    setEditingId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!form.title || !form.description || !form.date || !form.location || !form.price || !form.availableSeats || !form.category) {
      await Swal.fire({
        title: "Missing Fields!",
        text: "Please fill in all required fields.",
        icon: "warning"
      })
      return
    }

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)))
      if (image) formData.append("image", image)

      if (editingId) {
        await updateEvent(editingId, formData)
        await Swal.fire({
          title: "Updated!",
          text: "Event updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await createEvent(formData)
        await Swal.fire({
          title: "Created!",
          text: "Event created successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
      }

      resetForm()
      loadEvents()
    } catch (error: any) {
      await Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to save event. Please try again.",
        icon: "error"
      })
    }
  }

  const handleEdit = (event: Event) => {
    setEditingId(event._id)
    setForm({
      title: event.title,
      description: event.description,
      date: event.date?.split("T")[0] ?? "",
      location: event.location,
      price: event.price,
      availableSeats: event.availableSeats,
      category: event.category,
    })
    setImagePreview(event.image || null)
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed) {
      try {
        await deleteEvent(id)
        await Swal.fire({
          title: "Deleted!",
          text: "Event has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        })
        loadEvents()
      } catch (error: any) {
        await Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message || "Failed to delete event. Please try again.",
          icon: "error"
        })
      }
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
            {/* Dashboard link */}
            <Link
              to="/admin-dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="font-medium">Dashboard</span>}
            </Link>

            {/* Event Management link (active) */}
            <Link
              to="/admin/events"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
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
                Event Management
              </h1>
              <p className="text-purple-400 text-sm">Create, update, and manage events</p>
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
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-white text-lg font-bold mb-4">{editingId ? 'Update Event' : 'Create Event'}</h2>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
              <input className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" name="location" value={form.location} onChange={handleChange} placeholder="Location" />
              <input className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" type="date" name="date" value={form.date} onChange={handleChange} />
              <input className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" name="category" value={form.category} onChange={handleChange} placeholder="Category" />
              <div className="grid grid-cols-2 gap-3">
                <input className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                <input className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" name="availableSeats" value={form.availableSeats} onChange={handleChange} placeholder="Available Seats" />
              </div>
              <textarea className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-purple-300" name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={4} />
              
              {/* Image Upload */}
              <div className="w-full">
                <label className="block text-purple-300 text-sm mb-2">Event Image</label>
                {imagePreview && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-xl border border-white/10"
                    />
                  </div>
                )}
                <div className="relative">
                  <input 
                    ref={fileInputRef}
                    id="file-upload"
                    className="hidden" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange} 
                  />
                  <label 
                    htmlFor="file-upload"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{image ? image.name : "Choose Image"}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl transition-all font-medium"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button onClick={resetForm} className="px-5 py-2 bg-white/10 text-purple-200 rounded-xl">
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2 space-y-4">
            {events.length === 0 ? (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-purple-300">No events yet.</div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-xl shrink-0 border border-white/10"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-linear-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold text-lg">{event.title}</h3>
                      <p className="text-purple-300 text-sm">{event.location} • {new Date(event.date).toLocaleDateString()} • Rs.{event.price}</p>
                      <p className="text-purple-400 text-xs">Category: {event.category} • Seats: {event.availableSeats}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-xl"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminEvents
