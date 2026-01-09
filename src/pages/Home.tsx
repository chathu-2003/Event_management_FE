import Header from "./Header";


export default function Home() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Header />
    
      {/* Home Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full backdrop-blur-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></span>
            <span className="text-indigo-200 text-sm font-medium">Welcome to EventSphere Dashboard</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Manage Your Events</span><br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Like Never Before</span>
          </h1>

          <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-12">Your central hub for creating, managing, and tracking events. Streamline your workflow with powerful tools.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
     
            <button onClick={() => scrollToSection('about')} className="px-8 py-4 backdrop-blur-md bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all">Learn More</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Tech Conference 2025", date: "Jan 15", attendees: 500, icon: "🚀", color: "from-purple-500 to-pink-500" },
              { title: "Music Festival", date: "Feb 20", attendees: 2000, icon: "🎵", color: "from-blue-500 to-cyan-500" },
              { title: "Art Exhibition", date: "Mar 10", attendees: 300, icon: "🎨", color: "from-orange-500 to-red-500" },
              { title: "Business Summit", date: "Apr 5", attendees: 800, icon: "💼", color: "from-green-500 to-emerald-500" }
            ].map((event, i) => (
              <div key={i} className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className="text-5xl mb-4">{event.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-purple-300 text-sm mb-3">{event.date}</p>
                <div className="flex items-center text-purple-200 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {event.attendees} attendees
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            About EventSphere
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            Revolutionizing event management with real-time tools and insights.
          </p>
        </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-indigo-200">To empower event organizers with innovative tools that simplify workflows and deliver exceptional experiences.</p>
              </div>
              <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-indigo-200">To become the world's most trusted event management platform where creativity meets technology.</p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              {[
                { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />, title: "Modern Tech", desc: "React, TypeScript, MongoDB" },
                { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />, title: "Lightning Fast", desc: "Optimized for speed" },
                { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />, title: "Secure", desc: "Enterprise-grade security" }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-purple-200 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-8">Meet Our Team</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Sarah Chen", role: "CEO", image: "/images/team1.jpg" },
              { name: "Marcus Johnson", role: "CTO", image: "/images/team2.jpg" },
              { name: "Emily Rodriguez", role: "Design Lead", image: "/images/team3.jpg" },
              { name: "David Kim", role: "Developer", image: "/images/team4.jpg" },
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:scale-105 transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h4 className="text-white font-bold text-lg">{member.name}</h4>
                <p className="text-purple-300 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

 <section id="contact" className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Get In Touch</h2>
            <p className="text-xl text-purple-200">We'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, title: "Email", info: "contact@eventsphere.com" },
                { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />, title: "Phone", info: "+1 (555) 123-4567" },
                { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />, title: "Office", info: "San Francisco, CA" }
              ].map((item, i) => (
                <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-indigo-200">{item.info}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/20 rounded-3xl p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-indigo-200 font-medium mb-2">Name</label>
                  <input type="text" placeholder="Your name" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-indigo-200 font-medium mb-2">Email</label>
                  <input type="email" placeholder="your.email@example.com" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-indigo-200 font-medium mb-2">Message</label>
                  <textarea rows={5} placeholder="Your message..." className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl hover:scale-105 transition-all hover:shadow-2xl hover:shadow-indigo-500/50">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-md bg-white/5 py-8 px-6 text-center">
        <p className="text-indigo-300 font-medium">© 2025 EventSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}
