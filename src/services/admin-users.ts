import api from "./api"

export interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  roles: ("ADMIN" | "AUTHOR" | "USER")[]
  approved: "NONE" | "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  updatedAt: string
}

// GET ALL USERS (Admin view)
export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get("/auth/users/all")
  return res.data.data || res.data
}

// UPDATE USER ROLE AND APPROVAL (Admin action)
export const updateUser = async (
  userId: string,
  data: { roles?: string[]; approved?: string }
): Promise<User> => {
  const res = await api.patch(`/auth/users/${userId}`, data)
  return res.data.data || res.data
}

// DELETE USER (Admin action)
export const deleteUser = async (userId: string): Promise<User> => {
  const res = await api.delete(`/auth/users/${userId}`)
  return res.data.data || res.data
}
