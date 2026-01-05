import api from "./api"

export interface AdminSummary {
  totalUsers: number
  totalEvents: number
  totalBookings: number
  pendingBookings: number
}

// Get admin dashboard summary
export const getAdminSummary = async (): Promise<AdminSummary> => {
  const res = await api.get("/admin/dashboard/summary")
  return res.data
}
