import api from './api';

export const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', {
        email: username,
        password: password,
    });
    return res.data;
}

export const register = async (firstname: string, lastname: string, email: string, password: string) => {
    const res = await api.post('/auth/register', {
        firstname,
        lastname,
        email,
        password,
    });
    return res.data;
}

// ✅ Get logged-in user details
export const getMyDetails = async () => {
  const res = await api.get("/auth/me"); // No token needed here; api adds it automatically
  return res.data;
};

export const refreshToken = async (refreshToken: string) => {
    const res = await api.post('/auth/refresh', {
        token: refreshToken,
    });
    return res.data;
}