// Centralized API Service for StudyFlow Frontend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Helper function to make authenticated fetch requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('studyflow_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || `API request failed with status ${res.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message)
    throw error
  }
}

// 1. Authentication APIs
export const authApi = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (data) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// 2. Subject APIs
export const subjectApi = {
  getAll: () => request('/subjects'),

  create: (subjectData) =>
    request('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    }),

  update: (id, subjectData) =>
    request(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    }),

  delete: (id) =>
    request(`/subjects/${id}`, {
      method: 'DELETE',
    }),
}

// 3. Task APIs
export const taskApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    if (params.status) query.append('status', params.status)
    if (params.subject) query.append('subject', params.subject)
    if (params.priority) query.append('priority', params.priority)
    if (params.search) query.append('search', params.search)
    const qs = query.toString()
    return request(`/tasks${qs ? `?${qs}` : ''}`)
  },

  create: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  toggleStatus: (id) =>
    request(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    }),

  update: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  delete: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),
}

// 4. Note APIs
export const noteApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams()
    if (params.subject) query.append('subject', params.subject)
    if (params.search) query.append('search', params.search)
    const qs = query.toString()
    return request(`/notes${qs ? `?${qs}` : ''}`)
  },

  create: (noteData) =>
    request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    }),

  update: (id, noteData) =>
    request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    }),

  delete: (id) =>
    request(`/notes/${id}`, {
      method: 'DELETE',
    }),
}

// 5. Planner APIs
export const plannerApi = {
  getPlanner: () => request('/planner'),

  toggleSession: (sessionData) =>
    request('/planner/session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),
}

// 6. Dashboard Analytics API
export const dashboardApi = {
  getStats: () => request('/dashboard/stats'),
}

// 7. Academic Resources API
export const resourceApi = {
  getAll: () => request('/resources'),

  create: (resourceData) =>
    request('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    }),

  delete: (id) =>
    request(`/resources/${id}`, {
      method: 'DELETE',
    }),
}
