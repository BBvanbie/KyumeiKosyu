import type {
  AdminNotification,
  AvailabilityResponse,
  BlockedDate,
  BookingDraft,
  BookingSetting,
  ReservationCreatedResponse,
  ReservationLookupResult,
  Reservation,
  ReservationStatus,
  ReservationType,
  SiteContent,
} from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers,
    ...init,
  })

  if (!response.ok) {
    const message = await response
      .json()
      .then((body) => body.message as string | undefined)
      .catch(() => undefined)

    throw new Error(message ?? 'Request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const api = {
  getAdminMe: () => request<{ authenticated: boolean; username: string }>('/api/admin/me'),
  adminLogin: (payload: { username: string; password: string }) =>
    request<{ username: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  adminLogout: () =>
    request<void>('/api/admin/logout', {
      method: 'POST',
    }),
  getReservationTypes: () => request<ReservationType[]>('/api/reservation-types'),
  updateReservationType: (
    id: string,
    payload: Pick<ReservationType, 'durationMinutes' | 'textbookFee' | 'isActive'>
  ) =>
    request<ReservationType>(`/api/reservation-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getBlockedDates: () => request<BlockedDate[]>('/api/blocked-dates'),
  getBookingSettings: () => request<BookingSetting>('/api/booking-settings'),
  updateBookingSettings: (payload: Omit<BookingSetting, 'id' | 'updatedAt'>) =>
    request<BookingSetting>('/api/booking-settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getHomeSiteContent: () => request<SiteContent | null>('/api/site-content/home'),
  updateHomeSiteContent: (payload: Omit<SiteContent, 'id' | 'updatedAt'>) =>
    request<SiteContent>('/api/site-content/home', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getAvailability: () => request<AvailabilityResponse>('/api/booking-settings/availability'),
  createBlockedDate: (payload: { date: string; reason?: string }) =>
    request<BlockedDate>('/api/blocked-dates', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createBlockedDateRange: (payload: { startDate: string; endDate: string; reason?: string }) =>
    request<BlockedDate[]>('/api/blocked-dates/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getReservations: () => request<Reservation[]>('/api/reservations'),
  createReservation: (payload: BookingDraft) =>
    request<ReservationCreatedResponse>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  lookupReservation: (payload: { reservationNumber: string; confirmationCode: string }) =>
    request<ReservationLookupResult>('/api/public-reservations/lookup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  cancelReservation: (payload: { reservationNumber: string; confirmationCode: string }) =>
    request<{ reservation: ReservationLookupResult; fireStationPhone: string }>(
      '/api/public-reservations/cancel',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
  getAdminNotifications: () => request<AdminNotification[]>('/api/admin-notifications'),
  markAdminNotificationRead: (id: string) =>
    request<AdminNotification>(`/api/admin-notifications/${id}/read`, {
      method: 'PATCH',
    }),
  regenerateConfirmationCode: (id: string) =>
    request<{ confirmationCode: string }>(`/api/reservations/${id}/regenerate-code`, {
      method: 'POST',
    }),
  updateReservationStatus: (id: string, status: ReservationStatus) =>
    request<Reservation>(`/api/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}
