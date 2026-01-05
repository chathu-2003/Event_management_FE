import api from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableSeats: number;
  category: string;
  image?: string;
}

export interface BookingData {
  eventId: string;
  numberOfTickets: number;
  customerName: string;
  customerEmail: string;
}

export interface Booking {
  _id: string;
  eventId: Event;
  userId: string;
  numberOfTickets: number;
  totalPrice: number;
  status: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

// Get all available events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const res = await api.get('/events');
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get events by category
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    const res = await api.get(`/events?category=${category}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (eventId: string): Promise<Event> => {
  try {
    const res = await api.get(`/events/${eventId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Create a booking
export const createBooking = async (bookingData: BookingData) => {
  try {
    const res = await api.post('/bookings', bookingData);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get user's bookings
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const res = await api.get('/bookings/my-bookings');
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get a single booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const res = await api.get(`/bookings/${bookingId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  try {
    const res = await api.delete(`/bookings/${bookingId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Admin: create event
export const createEvent = async (event: Omit<Event, '_id'>) => {
  try {
    const res = await api.post('/events', event);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Admin: update event
export const updateEvent = async (eventId: string, event: Partial<Omit<Event, '_id'>>) => {
  try {
    const res = await api.put(`/events/${eventId}`, event);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Admin: delete event
export const deleteEvent = async (eventId: string) => {
  try {
    const res = await api.delete(`/events/${eventId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
