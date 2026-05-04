import React, { useState } from 'react'
import { Sparkles, Loader, MapPin, Calendar, Users, Heart, DollarSign, Plane } from 'lucide-react'
import './PlannerPage.css'

const INTERESTS = ['Culture & History', 'Food & Cuisine', 'Adventure', 'Nature', 'Shopping', 'Nightlife', 'Art & Museums', 'Beaches', 'Spiritual', 'Photography']

const DESTINATIONS = [
  { name: 'Tokyo', emoji: '🗾', tag: 'Asia' },
  { name: 'Paris', emoji: '🗼', tag: 'Europe' },
  { name: 'Bali', emoji: '🌴', tag: 'Asia' },
  { name: 'New York', emoji: '🗽', tag: 'Americas' },
  { name: 'Santorini', emoji: '🏛️', tag: 'Europe' },
  { name: 'Safari, Kenya', emoji: '🦁', tag: 'Africa' },
]

export default function PlannerPage({ onItineraryGenerated }) {
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '2',
    budget: 'moderate',
    interests: [],
  })
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')

  const toggleInterest = (i) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
    }))
  }

  const handleDestinationPick = (name) => {
    setForm(f => ({ ...f, destination: name }))
  }

  const LOADING_MSGS = [
    '✈️ Plotting your journey...',
    '🗺️ Curating local experiences...',
    '🏨 Finding perfect stays...',
    '🍜 Discovering hidden gems...',
    '📅 Building your day-by-day plan...',
  ]

  const generate = async () => {
    if (!form.destination || !form.startDate || !form.endDate) {
      setError('Please fill in destination and travel dates.')
      return
    }
    setError('')
    setLoading(true)

    let msgIdx = 0
    setLoadingMsg(LOADING_MSGS[0])
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[msgIdx])
    }, 1800)

    try {
      const days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000)

      const prompt = `You are an expert AI travel planner. Create a detailed ${days}-day trip itinerary for ${form.destination}.

Traveler details:
- Travelers: ${form.travelers} people
- Budget level: ${form.budget}
- Interests: ${form.interests.length ? form.interests.join(', ') : 'general sightseeing'}
- Dates: ${form.startDate} to ${form.endDate}

Return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{
  "destination": "city name",
  "tagline": "one inspiring sentence about this destination",
  "weather": "expected weather for travel dates",
  "currency": "local currency info",
  "days": [
    {
      "day": 1,
      "date": "${form.startDate}",
      "theme": "Day theme title",
      "morning": { "time": "9:00 AM", "activity": "Activity name", "description": "2 sentences", "location": "Place name", "tip": "Local insider tip" },
      "afternoon": { "time": "1:00 PM", "activity": "Activity name", "description": "2 sentences", "location": "Place name", "tip": "Local insider tip" },
      "evening": { "time": "7:00 PM", "activity": "Restaurant/activity", "description": "2 sentences", "location": "Place name", "tip": "Local insider tip" }
    }
  ],
  "bookingSuggestions": {
    "flights": [
      { "type": "Economy", "airline": "Airline name", "approxPrice": "$XXX", "tip": "Booking tip" }
    ],
    "hotels": [
      { "name": "Hotel name", "stars": 4, "area": "Neighborhood", "approxPrice": "$XXX/night", "highlight": "What makes it special" }
    ],
    "activities": [
      { "name": "Activity name", "price": "$XX", "bookingTip": "Book in advance tip" }
    ]
  },
  "packingList": ["item1", "item2", "item3", "item4", "item5"],
  "reminders": [
    { "daysBeforeDep": 30, "task": "Reminder task" },
    { "daysBeforeDep": 7, "task": "Reminder task" },
    { "daysBeforeDep": 1, "task": "Reminder task" }
  ]
}`

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        })
      })

      const data = await response.json()
      const text = data.choices.map(c => c.message?.content || '').join('')
      const clean = text.replace(/```json|```/g, '').trim()
      const itinerary = JSON.parse(clean)
      itinerary._form = form
      clearInterval(interval)
      setLoading(false)
      onItineraryGenerated(itinerary)
    } catch (err) {
      clearInterval(interval)
      setLoading(false)
      setError('Could not generate itinerary. Please check your connection and try again.')
    }
  }

  return (
    <div className="planner-page">
      <div className="planner-hero">
        <div className="hero-texture" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={14} />
            AI-Powered Travel Planning
          </div>
          <h1>Where will you<br /><em>wander next?</em></h1>
          <p>Describe your dream trip and our AI agent will craft a personalized itinerary, find the best deals, and keep you on track.</p>
        </div>
      </div>

      <div className="planner-form-wrap">
        <div className="quick-destinations">
          <p className="section-label">Popular Destinations</p>
          <div className="dest-chips">
            {DESTINATIONS.map(d => (
              <button
                key={d.name}
                className={`dest-chip ${form.destination === d.name ? 'selected' : ''}`}
                onClick={() => handleDestinationPick(d.name)}
              >
                <span>{d.emoji}</span>
                <span>{d.name}</span>
                <span className="dest-tag">{d.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label><MapPin size={14} /> Destination</label>
            <input
              type="text"
              placeholder="e.g. Tokyo, Japan"
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label><Calendar size={14} /> Departure Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label><Calendar size={14} /> Return Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label><Users size={14} /> Travelers</label>
            <select value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))}>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label><DollarSign size={14} /> Budget Level</label>
            <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>
              <option value="budget">Budget ($)</option>
              <option value="moderate">Moderate ($$)</option>
              <option value="luxury">Luxury ($$$)</option>
              <option value="ultra-luxury">Ultra Luxury ($$$$)</option>
            </select>
          </div>
        </div>

        <div className="interests-section">
          <label><Heart size={14} /> Your Interests</label>
          <div className="interest-chips">
            {INTERESTS.map(i => (
              <button
                key={i}
                className={`interest-chip ${form.interests.includes(i) ? 'active' : ''}`}
                onClick={() => toggleInterest(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="generate-btn" onClick={generate} disabled={loading}>
          {loading ? (
            <>
              <Loader size={18} className="spin" />
              {loadingMsg}
            </>
          ) : (
            <>
              <Plane size={18} />
              Generate My Itinerary
            </>
          )}
        </button>

        {loading && (
          <div className="loading-bar-wrap">
            <div className="loading-bar" />
          </div>
        )}
      </div>
    </div>
  )
}
