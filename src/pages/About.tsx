import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "./Header"

export default function About() {
  const [activeTab, setActiveTab] = useState("story")

  const stats = [
    { number: "50K+", label: "Active Users", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { number: "10K+", label: "Events Created", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { number: "99.9%", label: "Uptime", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
    { number: "150+", label: "Countries", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> }
  ]

  const values = [
    { title: "Innovation First", desc: "We constantly push boundaries and embrace new technologies", icon: "💡", color: "from-yellow-500 to-orange-500" },
    { title: "User Focused", desc: "Every decision is made with our users' needs in mind", icon: "❤️", color: "from-red-500 to-pink-500" },
    { title: "Transparency", desc: "Open communication and honest relationships with our community", icon: "🔍", color: "from-blue-500 to-cyan-500" },
    { title: "Excellence", desc: "We maintain the highest standards in everything we deliver", icon: "⭐", color: "from-purple-500 to-indigo-500" }
  ]

  const timeline = [
    { year: "2020", event: "Company Founded", desc: "EventSphere was born from a vision to revolutionize event management" },
    { year: "2021", event: "First 1K Users", desc: "Reached our first major milestone with rapid user adoption" },
    { year: "2022", event: "Series A Funding", desc: "Secured $10M to accelerate product development" },
    { year: "2023", event: "Global Expansion", desc: "Launched in 50+ countries worldwide" },
    { year: "2024", event: "10K Events Milestone", desc: "Celebrated 10,000 successful events on our platform" },
    { year: "2025", event: "AI Integration", desc: "Introduced AI-powered event planning features" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm mb-6">
            <span className="text-purple-200 text-sm font-medium">EST. 2020 • Building the Future of Events</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">We're On a Mission</span><br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">To Transform Events</span>
          </h1>

          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-12">EventSphere empowers organizers worldwide to create unforgettable experiences through innovative technology and intuitive design.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center hover:scale-105 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{stat.icon}</svg>
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">{stat.number}</div>
                <div className="text-purple-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center space-x-4 mb-12">
            {["story", "mission", "values"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-12">
            {activeTab === "story" && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
                <p className="text-purple-200 text-lg leading-relaxed">EventSphere was founded in 2020 by a team of passionate event organizers who experienced firsthand the challenges of managing complex events with outdated tools. We envisioned a platform that would combine cutting-edge technology with intuitive design to make event management accessible to everyone.</p>
                <p className="text-purple-200 text-lg leading-relaxed">What started as a small project in a garage has grown into a global platform serving thousands of organizers across 150+ countries. Our journey has been driven by one simple belief: great events deserve great tools.</p>
                <p className="text-purple-200 text-lg leading-relaxed">Today, EventSphere powers everything from intimate workshops to massive international conferences, and we're just getting started. We're committed to continuous innovation and building features that truly matter to our users.</p>
              </div>
            )}

            {activeTab === "mission" && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-white mb-6">Our Mission & Vision</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="backdrop-blur-md bg-white/5 rounded-2xl p-8">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Mission</h3>
                    <p className="text-purple-200 leading-relaxed">To democratize event management by providing world-class tools that are powerful yet simple, enabling anyone to create extraordinary experiences regardless of their technical expertise or budget.</p>
                  </div>
                  <div className="backdrop-blur-md bg-white/5 rounded-2xl p-8">
                    <div className="text-5xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Vision</h3>
                    <p className="text-purple-200 leading-relaxed">To be the world's most trusted and innovative event management platform, where every organizer finds the perfect solution and every attendee enjoys seamless experiences.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "values" && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-white mb-6">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((value, i) => (
                    <div key={i} className="backdrop-blur-md bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className={`text-5xl bg-gradient-to-br ${value.color} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}>
                          {value.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                          <p className="text-purple-200">{value.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-xl text-purple-200">Milestones that shaped EventSphere</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500"></div>
            
            {timeline.map((item, i) => (
              <div key={i} className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.event}</h3>
                    <p className="text-purple-200">{item.desc}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full border-4 border-gray-900 shadow-lg"></div>
                
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Achievements</h2>
            <p className="text-xl text-purple-200">Recognition and milestones we're proud of</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: "🏆", 
                title: "Best Event Platform 2024", 
                desc: "Awarded by Tech Innovation Awards for outstanding platform design",
                color: "from-yellow-500 to-orange-500"
              },
              { 
                icon: "⭐", 
                title: "4.9/5 User Rating", 
                desc: "Consistently rated as the top event management solution",
                color: "from-purple-500 to-pink-500"
              },
              { 
                icon: "🚀", 
                title: "Fastest Growing Startup", 
                desc: "Featured in Forbes' Top 50 Fastest Growing Tech Companies",
                color: "from-blue-500 to-cyan-500"
              },
              { 
                icon: "🌟", 
                title: "Industry Leader Award", 
                desc: "Recognized for innovation in event technology solutions",
                color: "from-green-500 to-emerald-500"
              },
              { 
                icon: "💎", 
                title: "Excellence in Design", 
                desc: "Winner of UX Design Awards for intuitive interface",
                color: "from-indigo-500 to-purple-500"
              },
              { 
                icon: "🎯", 
                title: "Customer Choice 2024", 
                desc: "Voted #1 by event organizers worldwide",
                color: "from-red-500 to-pink-500"
              },
              { 
                icon: "🔒", 
                title: "Security Excellence", 
                desc: "ISO 27001 certified for information security management",
                color: "from-teal-500 to-blue-500"
              },
              { 
                icon: "🌍", 
                title: "Global Impact Award", 
                desc: "Recognized for empowering communities through technology",
                color: "from-orange-500 to-red-500"
              },
              { 
                icon: "💼", 
                title: "Best Business Solution", 
                desc: "Enterprise Software of the Year by Business Tech Review",
                color: "from-violet-500 to-purple-500"
              }
            ].map((achievement, i) => (
              <div key={i} className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
                <div className={`w-20 h-20 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center text-4xl mb-4 transform group-hover:rotate-12 transition-transform`}>
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{achievement.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Trusted by Industry Leaders</h3>
            <p className="text-purple-200 text-lg mb-8">Join thousands of organizations that chose EventSphere</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <div className="text-white text-2xl font-bold">TECH★CORP</div>
              <div className="text-white text-2xl font-bold">GlobalEvents™</div>
              <div className="text-white text-2xl font-bold">INNOVATE</div>
              <div className="text-white text-2xl font-bold">SUMMIT+</div>
              <div className="text-white text-2xl font-bold">EventPro</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Join Our Journey</h2>
          <p className="text-xl text-purple-200 mb-12">Be part of the event management revolution</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:scale-105 transition-all hover:shadow-2xl hover:shadow-purple-500/50 inline-block">
              Get Started Free
            </Link>
            <a href="#contact" className="px-10 py-5 backdrop-blur-md bg-white/10 border border-white/20 text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all inline-block">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-md bg-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-300 font-medium">© 2025 EventSphere. All rights reserved.</p>
          <p className="text-purple-400/60 text-sm mt-2">Building the future of event management</p>
        </div>
      </footer>
    </div>
  )
}