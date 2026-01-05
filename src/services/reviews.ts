import api from "./api"

export interface Review {
  _id?: string
  eventId: string | { _id: string; title: string }  // Can be string or populated object
  userId: string | { _id: string; email: string }    // Can be string or populated object
  userName?: string
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export const createReview = async (review: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/reviews', review)
  return response.data.data || response.data
}

export const getEventReviews = async (eventId: string) => {
  const response = await api.get(`/reviews/event/${eventId}`)
  return response.data.data || response.data
}

export const getAllReviews = async () => {
  const response = await api.get('/reviews')
  return response.data.data || response.data
}

export const updateReview = async (reviewId: string, review: Partial<Review>) => {
  const response = await api.put(`/reviews/${reviewId}`, review)
  return response.data.data || response.data
}

export const deleteReview = async (reviewId: string) => {
  const response = await api.delete(`/reviews/${reviewId}`)
  return response.data.data || response.data
}

export const getUserReviews = async (userId: string) => {
  const response = await api.get(`/reviews/user/${userId}`)
  return response.data.data || response.data
}
