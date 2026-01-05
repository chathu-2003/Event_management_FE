import api from './api'

export interface BookingData {
  eventId: string
  numberOfTickets: number
  customerName: string
  customerEmail: string
}

export interface Booking {
  _id: string
  eventId: string
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

export const createBooking = async (bookingData: BookingData) => {
  try {
    const res = await api.post('/bookings', bookingData)
    return res.data.data || res.data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const res = await api.get('/bookings/my-bookings')
    return res.data.data || res.data
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    throw error
  }
}

export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const res = await api.get(`/bookings/${bookingId}`)
    return res.data.data || res.data
  } catch (error) {
    console.error('Error fetching booking:', error)
    throw error
  }
}

export const cancelBooking = async (bookingId: string) => {
  try {
    const res = await api.delete(`/bookings/${bookingId}`)
    return res.data.data || res.data
  } catch (error) {
    console.error('Error cancelling booking:', error)
    throw error
  }
}
