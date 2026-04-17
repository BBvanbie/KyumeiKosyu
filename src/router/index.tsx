import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { AdminLayout } from '../components/admin/AdminLayout'
import { RequireAdmin } from '../components/admin/RequireAdmin'
import { HomePage } from '../pages/HomePage'
import { ReservationConfirmPage } from '../pages/ReservationConfirmPage'
import { ReservationFormPage } from '../pages/ReservationFormPage'
import { ReservationLookupPage } from '../pages/ReservationLookupPage'
import { ReservationLookupResultPage } from '../pages/ReservationLookupResultPage'
import { ReservePage } from '../pages/ReservePage'
import { AdminBlockedDatesPage } from '../pages/admin/AdminBlockedDatesPage'
import { AdminHomePage } from '../pages/admin/AdminHomePage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminReservationsPage } from '../pages/admin/AdminReservationsPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'reserve',
        element: <ReservePage />,
      },
      {
        path: 'reserve/form',
        element: <ReservationFormPage />,
      },
      {
        path: 'reserve/confirm',
        element: <ReservationConfirmPage />,
      },
      {
        path: 'reservation/lookup',
        element: <ReservationLookupPage />,
      },
      {
        path: 'reservation/lookup/result',
        element: <ReservationLookupResultPage />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      {
        index: true,
        element: <AdminHomePage />,
      },
      {
        path: 'reservations',
        element: <AdminReservationsPage />,
      },
      {
        path: 'blocked-dates',
        element: <AdminBlockedDatesPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },
])
