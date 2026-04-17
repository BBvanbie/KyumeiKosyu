import { FiCalendar, FiHome, FiList, FiSettings } from 'react-icons/fi'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminLayout() {
  const { logout, username } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="brand-mark">救命講習予約システム</p>
          <h2 className="admin-sidebar__title">管理メニュー</h2>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <FiHome />
            <span>ホーム</span>
          </NavLink>
          <NavLink to="/admin/reservations">
            <FiList />
            <span>予約一覧</span>
          </NavLink>
          <NavLink to="/admin/blocked-dates">
            <FiCalendar />
            <span>予約不可日</span>
          </NavLink>
          <NavLink to="/admin/settings">
            <FiSettings />
            <span>設定</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <p className="admin-sidebar__user">{username}</p>
          <button className="button button-secondary" onClick={() => void logout()} type="button">
            ログアウト
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
