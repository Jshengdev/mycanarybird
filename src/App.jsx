import './canary.css'
import Nav from './components/sections/Nav'
import Hero from './components/sections/Hero'
import Problem from './components/sections/Problem'
import Solution from './components/sections/Solution'
import HowItWorks from './components/sections/HowItWorks'
import LiveFeed from './components/sections/LiveFeed'
import Invitation from './components/sections/Invitation'

export default function App() {
  return (
    <div className="canary-root">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <LiveFeed />
      <Invitation />
    </div>
  )
}
