import React, { useState } from "react"
import Header from "./Header"


export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  // Removed mock Header; using shared Header component

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Message sent!\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}`)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const contactInfo = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      title: "Email Us",
      primary: "contact@eventsphere.com",
      secondary: "support@eventsphere.com",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
      title: "Call Us",
      primary: "+1 (555) 123-4567",
      secondary: "Mon-Fri 9am-6pm EST",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
      title: "Visit Us",
      primary: "123 Event Street",
      secondary: "San Francisco, CA 94102",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
      title: "Working Hours",
      primary: "Monday - Friday",
      secondary: "9:00 AM - 6:00 PM EST",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const faqs = [
    {
      question: "How quickly can I get started?",
      answer: "You can start creating events immediately after signing up. Our onboarding process takes less than 5 minutes."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! We provide 24/7 customer support via email, live chat, and phone for all our users."
    },
    {
      question: "Can I integrate with other tools?",
      answer: "Absolutely! EventSphere integrates with popular tools like Zoom, Google Calendar, Mailchimp, and many more."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required."
    }
  ]

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", color: "from-blue-400 to-blue-600" },
    { name: "LinkedIn", icon: "in", color: "from-blue-600 to-blue-800" },
    { name: "Facebook", icon: "f", color: "from-blue-500 to-indigo-600" },
    { name: "Instagram", icon: "📷", color: "from-pink-500 to-purple-600" }
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
            <span className="text-purple-200 text-sm font-medium">We're Here to Help • 24/7 Support</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Get in Touch</span><br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">We'd Love to Hear From You</span>
          </h1>

          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-12">Have questions about EventSphere? Our team is ready to help you create amazing events.</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, i) => (
              <div key={i} className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{info.icon}</svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{info.title}</h3>
                <p className="text-purple-200 mb-1">{info.primary}</p>
                <p className="text-purple-300 text-sm">{info.secondary}</p>
              </div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-purple-200 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  >
                    <option value="" className="bg-gray-900">Select a subject</option>
                    <option value="general" className="bg-gray-900">General Inquiry</option>
                    <option value="support" className="bg-gray-900">Technical Support</option>
                    <option value="sales" className="bg-gray-900">Sales Question</option>
                    <option value="partnership" className="bg-gray-900">Partnership Opportunity</option>
                    <option value="feedback" className="bg-gray-900">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all hover:shadow-2xl hover:shadow-purple-500/50"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Info and Social */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-white font-bold text-xl mb-2">Find Us on the Map</h3>
                  <p className="text-purple-200">123 Event Street, San Francisco</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, i) => (
                    <button
                      key={i}
                      className={`backdrop-blur-md bg-gradient-to-br ${social.color} border border-white/20 rounded-xl p-4 hover:scale-105 transition-all text-white font-bold flex items-center justify-center space-x-2`}
                    >
                      <span className="text-2xl">{social.icon}</span>
                      <span>{social.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Response */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">Quick Response Time</h4>
                    <p className="text-green-200">We typically respond within 2 hours during business hours and 24 hours on weekends.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-purple-200">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <h3 className="text-white font-bold text-lg mb-3 flex items-start">
                  <span className="text-purple-400 mr-2">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-purple-200 pl-6">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-purple-300 mb-4">Still have questions?</p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/50">
              View Full FAQ
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 backdrop-blur-md bg-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-300 font-medium">© 2025 EventSphere. All rights reserved.</p>
          <p className="text-purple-400/60 text-sm mt-2">Your trusted event management partner</p>
        </div>
      </footer>
    </div>
  )
}