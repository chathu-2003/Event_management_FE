import api from "./api"

export interface BookingWithDetails {
  _id: string
  eventId: {
    _id: string
    title: string
    date: string
    location: string
    price: number
    category: string
    image?: string
  }
  userId: {
    _id: string
    email: string
    firstname?: string
    lastname?: string
  }
  numberOfTickets: number
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  customerName: string
  customerEmail: string
  bookingDate: string
  approvedBy?: {
    adminId: string
    adminName: string
    approvedAt: string
  }
  declinedBy?: {
    adminId: string
    adminName: string
    declinedAt: string
  }
  createdAt: string
  updatedAt: string
}

// GET ALL BOOKINGS (Admin view)
export const getAllBookings = async (): Promise<BookingWithDetails[]> => {
  const res = await api.get("/bookings")
  return res.data.data || res.data
}

// APPROVE BOOKING (Admin action)
export const approveBooking = async (bookingId: string): Promise<BookingWithDetails> => {
  const res = await api.patch(`/bookings/${bookingId}/approve`)
  return res.data.data || res.data
}

// DECLINE/CANCEL BOOKING (Admin action)
export const declineBooking = async (bookingId: string): Promise<BookingWithDetails> => {
  const res = await api.patch(`/bookings/${bookingId}/decline`)
  return res.data.data || res.data
}
