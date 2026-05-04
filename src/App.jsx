import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import PlannerPage from './pages/PlannerPage.jsx'
import ItineraryPage from './pages/ItineraryPage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import './App.css'

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'reminder', title: 'Flight Check-in Opens', body: 'Your Tokyo flight check-in opens in 24 hours.', time: '2 min ago', read: false },
  { id: 2, type: 'update', title: 'Price Drop Alert', body: 'Hotel Asakusa View dropped ¥3,200/night!', time: '1 hr ago', read: false },
  { id: 3, type: 'tip', title: 'Local Tip', body: 'Best ramen near Shinjuku: Ichiran opens at 10am.', time: '3 hr ago', read: true },
  { id: 4, type: 'reminder', title: 'Visa Reminder', body: 'Apply for Japan eVisa at least 7 days before departure.', time: 'Yesterday', read: true },
]

export default function App() {
  const [activePage, setActivePage] = useState('planner')
  const [itinerary, setItinerary] = useState(null)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [unread, setUnread] = useState(2)

  useEffect(() => {
    setUnread(notifications.filter(n => !n.read).length)
  }, [notifications])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        unread={unread}
        hasItinerary={!!itinerary}
      />
      <main className="main-content">
        {activePage === 'planner' && (
          <PlannerPage onItineraryGenerated={(it) => { setItinerary(it); setActivePage('itinerary') }} />
        )}
        {activePage === 'itinerary' && (
          <ItineraryPage itinerary={itinerary} setActivePage={setActivePage} />
        )}
        {activePage === 'bookings' && <BookingsPage itinerary={itinerary} />}
        {activePage === 'notifications' && (
          <NotificationsPage notifications={notifications} markAllRead={markAllRead} />
        )}
      </main>
    </div>
  )
}
