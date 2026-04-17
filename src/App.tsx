import { FiShield, FiUser } from 'react-icons/fi'
import { NavLink, Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div>
            <p className="brand-mark">救命講習予約システム</p>
            <p className="brand-subtitle">講習予約と管理を一つにまとめる</p>
          </div>

          <nav className="header-actions" aria-label="utility navigation">
            <NavLink to="/">
              <FiUser />
              <span>ホーム</span>
            </NavLink>
            <NavLink to="/reserve">
              <FiUser />
              <span>予約</span>
            </NavLink>
            <NavLink to="/admin/login">
              <FiShield />
              <span>管理者</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}

export default App
