// Home Page Component - HTML/CSS/JS Concepts
import { useState, useEffect } from 'react'

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [counter, setCounter] = useState(0)

  // useEffect Hook - Component Lifecycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer) // Cleanup
  }, [])

  // Event Handlers - JavaScript Functions
  const handleIncrement = () => setCounter(prev => prev + 1)
  const handleDecrement = () => setCounter(prev => prev - 1)
  const handleReset = () => setCounter(0)

  return (
    <div className="home-page">
      {/* Semantic HTML Elements */}
      <header className="hero-section">
        <h1>MERN Stack Final Exam Practice</h1>
        <p>Complete application covering all exam topics</p>
      </header>

      <main className="main-content">
        {/* HTML/CSS/JS Demonstration */}
        <section className="demo-section">
          <h2>HTML/CSS/JS Concepts</h2>
          
          {/* Real-time Clock */}
          <div className="clock-widget">
            <h3>Current Time</h3>
            <p className="time-display">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>

          {/* Interactive Counter */}
          <div className="counter-widget">
            <h3>Interactive Counter</h3>
            <div className="counter-display">
              <span className="counter-value">{counter}</span>
            </div>
            <div className="counter-controls">
              <button onClick={handleDecrement} className="btn btn-danger">
                -
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
              <button onClick={handleIncrement} className="btn btn-success">
                +
              </button>
            </div>
          </div>
        </section>

        {/* Exam Topics Covered */}
        <section className="topics-section">
          <h2>Exam Topics Covered</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>HTML/CSS/JS</h3>
              <ul>
                <li>Semantic HTML elements</li>
                <li>CSS Flexbox/Grid layouts</li>
                <li>JavaScript ES6+ features</li>
                <li>DOM manipulation</li>
                <li>Event handling</li>
              </ul>
            </div>
            
            <div className="topic-card">
              <h3>React + Vite</h3>
              <ul>
                <li>Functional components</li>
                <li>useState & useEffect hooks</li>
                <li>React Router navigation</li>
                <li>Context API for state</li>
                <li>Component lifecycle</li>
              </ul>
            </div>
            
            <div className="topic-card">
              <h3>Node.js + Express</h3>
              <ul>
                <li>RESTful API design</li>
                <li>Express middleware</li>
                <li>MongoDB integration</li>
                <li>Error handling</li>
                <li>CORS configuration</li>
              </ul>
            </div>
            
            <div className="topic-card">
              <h3>Authentication</h3>
              <ul>
                <li>JWT tokens</li>
                <li>Password hashing</li>
                <li>Protected routes</li>
                <li>Authorization levels</li>
                <li>Session management</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
