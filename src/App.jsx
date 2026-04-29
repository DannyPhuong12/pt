import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'
import CalendarPage from './components/CalendarPage'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="navbar">
          <span className="nav-brand">Personal Trainer</span>
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Asiakkaat
            </NavLink>
            <NavLink to="/trainings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Harjoitukset
            </NavLink>
            <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Kalenteri
            </NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/trainings" element={<TrainingList />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App