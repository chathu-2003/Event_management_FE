import api from './api'

export interface MyBooking {
  _id: string
  eventId: {
    _id: string
    title: string
    description: string
    date: string
    location: string
    price: number
    category?: string
    image?: string       // Cloudinary URL from backend
    imageUrl?: string    // Alternative field name
  }
  userId: string
  numberOfTickets: number
  totalPrice: number
  status: string
  customerName: string
  customerEmail: string
  bookingDate: string
  createdAt: string
  updatedAt: string
}

export const getMyBookings = async (): Promise<MyBooking[]> => {
  try {
    const res = await api.get('/bookings/my-bookings')
    return res.data.data || res.data
  } catch (error) {
    console.error('Error fetching my bookings:', error)
    throw error
  }
}

export const cancelMyBooking = async (bookingId: string) => {
  try {
    const res = await api.delete(`/bookings/${bookingId}`)
    return res.data
  } catch (error) {
    console.error('Error canceling booking:', error)
    throw error
  }
}
