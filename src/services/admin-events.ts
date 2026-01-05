import api from "./api"
import type { Event } from "./events"

// GET ALL EVENTS (Admin view)
export const getAdminEvents = async (): Promise<Event[]> => {
  const res = await api.get("/events")
  return res.data.data || res.data
}

// CREATE EVENT
export const createEvent = async (formData: FormData): Promise<Event> => {
  const res = await api.post("/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data.data || res.data
}

// UPDATE EVENT
export const updateEvent = async (
  eventId: string,
  formData: FormData
): Promise<Event> => {
  const res = await api.put(`/events/${eventId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data.data || res.data
}

// DELETE EVENT
export const deleteEvent = async (eventId: string) => {
  const res = await api.delete(`/events/${eventId}`)
  return res.data.data || res.data
}
