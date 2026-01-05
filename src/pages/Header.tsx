import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'

export default function Header() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    window.location.href = "/login"
  }

  // Removed unused scrollToSection helper

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl border-b border-purple-500/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-md opacity-75"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              EventSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
            >
              About
            </Link>
            <Link
              to="/events"
              className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
            >
              Events
            </Link>
                        <Link
              to="/bookings"
              className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
            >
              Bookings
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
              >
                My Bookings
              </Link>
            )}
            <Link
              to="/reviews"
              className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
            >
              Reviews
            </Link>
            <Link
              to="/contact"
              className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
            >
              Contact
            </Link>

            {user?.roles?.includes("ADMIN") && (
              <Link
                to="/admin/events"
                className="relative px-4 py-2 font-semibold capitalize transition-all duration-300 text-purple-300 hover:text-white"
              >
                Admin
              </Link>
            )}

          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-purple-300 font-medium px-4 py-2">
                  {user.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-rose-500/50 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 text-white font-medium hover:text-purple-300 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-500/20">
            <div className="flex flex-col space-y-3 mt-4">
              <Link
                to="/home"
                className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
              >
                Contact
              </Link>
              <Link
                to="/events"
                className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
              >
                Events
              </Link>
              <Link
                to="/bookings"
                className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
              >
                Bookings
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
                >
                  My Bookings
                </Link>
              )}
              <Link
                to="/reviews"
                className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
              >
                Reviews
              </Link>
              {user?.roles?.includes("ADMIN") && (
                <Link
                  to="/admin/events"
                  className="px-4 py-2 text-left text-purple-300 hover:text-white capitalize transition-colors inline-block w-full"
                >
                  Admin
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-3 border-t border-purple-500/20">
                {user ? (
                  <>
                    <span className="px-4 py-2 text-purple-300 font-medium text-sm">
                      {user.email || user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-rose-500/50 transition-all text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-white font-medium hover:text-purple-300 transition-colors text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg text-left"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}