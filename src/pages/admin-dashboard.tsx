import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { getAdminSummary } from "../services/admin-dashboard"
import { getAllBookings } from "../services/admin-bookings"
import { getAllUsers } from "../services/admin-users"
import { getAdminEvents } from "../services/admin-events"
import { getAllReviews } from "../services/reviews"
import jsPDF from "jspdf"
import type { AdminSummary } from "../services/admin-dashboard"
import type { BookingWithDetails } from "../services/admin-bookings"
import type { User } from "../services/admin-users"
import type { Event } from "../services/events"
import type { Review } from "../services/reviews"

const AdminDashboard = () => {
  const { user, setUser } = useAuth()
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [chartData, setChartData] = useState<any>(null)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [confirmedRevenue, setConfirmedRevenue] = useState(0)
  const [pendingRevenue, setPendingRevenue] = useState(0)

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setUser?.(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    let isMounted = true
    const fetchAllData = async () => {
      try {
        const [summaryData, bookingsData, usersData, eventsData, reviewsData] = await Promise.all([
          getAdminSummary(),
          getAllBookings(),
          getAllUsers(),
          getAdminEvents(),
          getAllReviews()
        ])
        
        if (isMounted) {
          setSummary(summaryData)
          setBookings(bookingsData)
          
          // Calculate revenue
          const total = bookingsData.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
          const confirmed = bookingsData
            .filter(b => b.status === "CONFIRMED")
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
          const pending = bookingsData
            .filter(b => b.status === "PENDING")
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
          
          setTotalRevenue(total)
          setConfirmedRevenue(confirmed)
          setPendingRevenue(pending)
          
          // Calculate chart data
          calculateChartData(bookingsData, usersData, eventsData, reviewsData)
        }
      } catch (e) {
        console.error("Failed to fetch admin data", e)
      }
    }
    fetchAllData()
    return () => {
      isMounted = false
    }
  }, [])

  const calculateChartData = (bookingsData: BookingWithDetails[], usersData: User[], eventsData: Event[], reviewsData: Review[]) => {
    // Booking Status Distribution (Pie Chart)
    const bookingStatusCounts = {
      CONFIRMED: bookingsData.filter(b => b.status === "CONFIRMED").length,
      PENDING: bookingsData.filter(b => b.status === "PENDING").length,
      CANCELLED: bookingsData.filter(b => b.status === "CANCELLED").length
    }

    // User Roles Distribution (Pie Chart)
    const roleCounts = {
      ADMIN: usersData.filter(u => u.roles.includes("ADMIN")).length,
      AUTHOR: usersData.filter(u => u.roles.includes("AUTHOR")).length,
      USER: usersData.filter(u => u.roles.includes("USER")).length
    }

    // User Approval Status (Pie Chart)
    const approvalCounts = {
      APPROVED: usersData.filter(u => u.approved === "APPROVED").length,
      PENDING: usersData.filter(u => u.approved === "PENDING").length,
      REJECTED: usersData.filter(u => u.approved === "REJECTED").length,
      NONE: usersData.filter(u => u.approved === "NONE").length
    }

    // Event Category Distribution (Bar Chart)
    const categoryCount: { [key: string]: number } = {}
    eventsData.forEach(event => {
      const cat = event.category || "Uncategorized"
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    // Rating Distribution (Bar Chart)
    const ratingCounts = {
      5: reviewsData.filter((r: Review) => r.rating === 5).length,
      4: reviewsData.filter((r: Review) => r.rating === 4).length,
      3: reviewsData.filter((r: Review) => r.rating === 3).length,
      2: reviewsData.filter((r: Review) => r.rating === 2).length,
      1: reviewsData.filter((r: Review) => r.rating === 1).length
    }

    setChartData({
      bookingStatus: [
        { name: "Confirmed", value: bookingStatusCounts.CONFIRMED, color: "#10b981" },
        { name: "Pending", value: bookingStatusCounts.PENDING, color: "#f59e0b" },
        { name: "Cancelled", value: bookingStatusCounts.CANCELLED, color: "#ef4444" }
      ],
      userRoles: [
        { name: "Admin", value: roleCounts.ADMIN, color: "#8b5cf6" },
        { name: "Author", value: roleCounts.AUTHOR, color: "#3b82f6" },
        { name: "User", value: roleCounts.USER, color: "#06b6d4" }
      ],
      userApproval: [
        { name: "Approved", value: approvalCounts.APPROVED, color: "#10b981" },
        { name: "Pending", value: approvalCounts.PENDING, color: "#f59e0b" },
        { name: "Rejected", value: approvalCounts.REJECTED, color: "#ef4444" },
        { name: "None", value: approvalCounts.NONE, color: "#6b7280" }
      ],
      eventCategories: Object.entries(categoryCount).map(([name, value]) => ({
        name: name.substring(0, 12),
        fullName: name,
        value
      })),
      ratings: [
        { stars: "5★", count: ratingCounts[5] },
        { stars: "4★", count: ratingCounts[4] },
        { stars: "3★", count: ratingCounts[3] },
        { stars: "2★", count: ratingCounts[2] },
        { stars: "1★", count: ratingCounts[1] }
      ]
    })
  }

  const PieChart = ({ data, title }: { data: any[], title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) return null
    
    let cumulativeAngle = 0
    const paths = data.map((item, index) => {
      const slicePercentage = item.value / total
      const sliceAngle = slicePercentage * 360
      const startAngle = cumulativeAngle
      const endAngle = cumulativeAngle + sliceAngle
      cumulativeAngle = endAngle

      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180
      const x1 = 100 + 80 * Math.cos(startRad)
      const y1 = 100 + 80 * Math.sin(startRad)
      const x2 = 100 + 80 * Math.cos(endRad)
      const y2 = 100 + 80 * Math.sin(endRad)
      const largeArc = sliceAngle > 180 ? 1 : 0

      const pathData = [
        `M 100 100`,
        `L ${x1} ${y1}`,
        `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
        `Z`
      ].join(" ")

      return (
        <g key={index}>
          <path d={pathData} fill={item.color} opacity="0.8" />
          {slicePercentage > 0.1 && (
            <text
              x={100 + 50 * Math.cos((startRad + endRad) / 2)}
              y={100 + 50 * Math.sin((startRad + endRad) / 2)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold fill-white"
            >
              {(slicePercentage * 100).toFixed(0)}%
            </text>
          )}
        </g>
      )
    })

    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <svg viewBox="0 0 200 200" className="w-full h-48">
          {paths}
        </svg>
        <div className="mt-4 space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-purple-300">{item.name}</span>
              </div>
              <span className="text-white font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const BarChart = ({ data, title }: { data: any[], title: string }) => {
    const maxValue = Math.max(...data.map(d => d.value || d.count || 0), 1)
    
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, idx) => {
            const value = item.value || item.count || 0
            const percentage = (value / maxValue) * 100
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-300 font-medium">{item.name || item.stars || item.fullName}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const generateRevenuePDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      })

      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })

      // Set colors and fonts
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const leftMargin = 15
      const rightMargin = 15
      const contentWidth = pageWidth - leftMargin - rightMargin

      // Title
      pdf.setFontSize(24)
      pdf.setTextColor(51, 51, 51)
      pdf.text("EventSphere", leftMargin, 20)
      
      // Subtitle
      pdf.setFontSize(14)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Revenue Report", leftMargin, 28)

      // Date
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Generated: ${currentDate}`, leftMargin, 35)

      // Separator line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(leftMargin, 38, pageWidth - rightMargin, 38)

      // Revenue Summary Section
      pdf.setFontSize(14)
      pdf.setTextColor(51, 51, 51)
      pdf.text("Revenue Summary", leftMargin, 48)

      // Total Revenue Card
      pdf.setFillColor(240, 253, 244)
      pdf.rect(leftMargin, 52, contentWidth, 35, "F")
      pdf.setDrawColor(34, 197, 94)
      pdf.setLineWidth(0.5)
      pdf.rect(leftMargin, 52, contentWidth, 35)

      pdf.setFontSize(12)
      pdf.setTextColor(22, 101, 52)
      pdf.text("Total Revenue", leftMargin + 5, 60)
      
      pdf.setFontSize(18)
      pdf.setTextColor(22, 101, 52)
      pdf.text(`$${totalRevenue.toFixed(2)}`, leftMargin + 5, 72)

      // Confirmed Revenue Card
      pdf.setFillColor(240, 249, 255)
      pdf.rect(leftMargin, 90, contentWidth, 35, "F")
      pdf.setDrawColor(59, 130, 246)
      pdf.setLineWidth(0.5)
      pdf.rect(leftMargin, 90, contentWidth, 35)

      pdf.setFontSize(12)
      pdf.setTextColor(30, 58, 138)
      pdf.text("Confirmed Revenue", leftMargin + 5, 98)
      
      pdf.setFontSize(18)
      pdf.setTextColor(30, 58, 138)
      pdf.text(`$${confirmedRevenue.toFixed(2)}`, leftMargin + 5, 110)

      // Pending Revenue Card
      pdf.setFillColor(255, 251, 235)
      pdf.rect(leftMargin, 128, contentWidth, 35, "F")
      pdf.setDrawColor(245, 158, 11)
      pdf.setLineWidth(0.5)
      pdf.rect(leftMargin, 128, contentWidth, 35)

      pdf.setFontSize(12)
      pdf.setTextColor(120, 53, 15)
      pdf.text("Pending Revenue", leftMargin + 5, 136)
      
      pdf.setFontSize(18)
      pdf.setTextColor(120, 53, 15)
      pdf.text(`$${pendingRevenue.toFixed(2)}`, leftMargin + 5, 148)

      // Statistics Section
      pdf.setFontSize(14)
      pdf.setTextColor(51, 51, 51)
      pdf.text("Booking Statistics", leftMargin, 175)

      // Stats table
      const statsStartY = 182
      const stats = [
        { label: "Total Bookings", value: bookings.length },
        { label: "Confirmed Bookings", value: bookings.filter(b => b.status === "CONFIRMED").length },
        { label: "Pending Bookings", value: bookings.filter(b => b.status === "PENDING").length },
        { label: "Cancelled Bookings", value: bookings.filter(b => b.status === "CANCELLED").length }
      ]

      let currentY = statsStartY
      stats.forEach((stat) => {
        pdf.setFontSize(11)
        pdf.setTextColor(80, 80, 80)
        pdf.text(stat.label, leftMargin + 5, currentY)
        
        pdf.setTextColor(51, 51, 51)
        pdf.setFont("helvetica", "bold")
        pdf.text(String(stat.value), pageWidth - rightMargin - 5, currentY, { align: "right" })
        pdf.setFont("helvetica", "normal")
        
        currentY += 7
      })

      // Footer
      pdf.setFontSize(9)
      pdf.setTextColor(150, 150, 150)
      pdf.text(
        "This is an automatically generated report. All amounts are in USD.",
        leftMargin,
        pageHeight - 10
      )

      // Save PDF
      const fileName = `Revenue_Report_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      // Show success message
      alert("Revenue report downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again or contact support.")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-lg border-r border-white/10 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-lg">EventSphere</h1>
                  <p className="text-purple-400 text-xs">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {/* Dashboard link */}
            <Link
              to="/admin-dashboard"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="font-medium">Dashboard</span>}
            </Link>

            {/* Event Management link */}
            <Link
              to="/admin/events"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Event Management</span>}
            </Link>
            {/* Booking Management link */}
            <Link
              to="/admin/bookings"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {sidebarOpen && <span className="font-medium">Booking Management</span>}
            </Link>
            {/* User Management link */}
            <Link
              to="/admin/users"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M9 9H3v10a4 4 0 004 4h10a4 4 0 004-4V9h-6m0 0V5a2 2 0 10-4 0v4m0 0a2 2 0 104 0" />
              </svg>
              {sidebarOpen && <span className="font-medium">User Management</span>}
            </Link>

            <Link
              to="/admin/reviews"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-purple-300 hover:bg-white/5"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {sidebarOpen && <span className="font-medium">Review Management</span>}
            </Link>
          </nav>

          {/* Toggle Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-purple-300 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
              {sidebarOpen && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-purple-400 text-sm">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-white text-sm font-medium">
                      {user.email ?? `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim()}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-purple-400">Loading...</span>
              )}
            </div>
          </div>
        </nav>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="backdrop-blur-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-purple-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  +12%
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.totalUsers ?? 0}</h3>
              <p className="text-purple-300 text-sm font-medium">Total Users</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  +8%
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.totalEvents ?? 0}</h3>
              <p className="text-blue-300 text-sm font-medium">Total Events</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-orange-500/20 to-red-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  +23%
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.totalBookings ?? 0}</h3>
              <p className="text-orange-300 text-sm font-medium">Total Bookings</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-yellow-500/20 to-amber-500/20 border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-medium">
                  Pending
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{summary?.pendingBookings ?? 0}</h3>
              <p className="text-yellow-300 text-sm font-medium">Pending Approvals</p>
            </div>
          </div>

          {/* Total Revenue Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-3xl border border-white/10">
            <div className="backdrop-blur-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-green-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                  Total
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">${totalRevenue.toFixed(2)}</h3>
              <p className="text-green-300 text-sm font-medium">Total Revenue</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/20 to-sky-500/20 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                  Confirmed
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">${confirmedRevenue.toFixed(2)}</h3>
              <p className="text-blue-300 text-sm font-medium">Confirmed Revenue</p>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-orange-500/20 to-yellow-500/20 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-medium">
                  Pending
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">${pendingRevenue.toFixed(2)}</h3>
              <p className="text-orange-300 text-sm font-medium">Pending Revenue</p>
            </div>
          </div>

          {/* PDF Download Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={generateRevenuePDF}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Revenue Report (PDF)
            </button>
          </div>

          {/* New Analytical Conclusion Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Booking Status Distribution */}
            {chartData?.bookingStatus && <PieChart data={chartData.bookingStatus} title="Booking Status Distribution" />}
            
            {/* User Roles Distribution */}
            {chartData?.userRoles && <PieChart data={chartData.userRoles} title="User Roles Distribution" />}

            {/* Event Categories */}
            {chartData?.eventCategories && chartData.eventCategories.length > 0 && (
              <BarChart data={chartData.eventCategories} title="Events by Category" />
            )}

            {/* User Approval Status */}
            {chartData?.userApproval && <PieChart data={chartData.userApproval} title="User Approval Status" />}

            {/* Rating Distribution */}
            {chartData?.ratings && <BarChart data={chartData.ratings} title="Review Ratings Distribution" />}
          </div>

          {/* System Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Visual Growth Insight */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">System Growth Conclusion</h2>
              </div>
              
              <div className="h-40 w-full mt-4 relative">
                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                  <path 
                    d="M0 80 Q 50 70, 100 75 T 200 40 T 300 50 T 400 10 L 400 100 L 0 100 Z" 
                    fill="url(#gradDash)" 
                    className="opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  />
                  <path d="M0 80 Q 50 70, 100 75 T 200 40 T 300 50 T 400 10" fill="none" stroke="#3b82f6" strokeWidth="3" />
                  <defs>
                    <linearGradient id="gradDash" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.6 }} />
                      <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/5 pt-6 text-center">
                <div><p className="text-white font-bold text-lg">98%</p><p className="text-[10px] text-purple-400 uppercase font-bold">Uptime</p></div>
                <div><p className="text-white font-bold text-lg">{summary ? summary.totalBookings * 5 : 0}</p><p className="text-[10px] text-purple-400 uppercase font-bold">Total Hits</p></div>
                <div><p className="text-white font-bold text-lg">Stable</p><p className="text-[10px] text-purple-400 uppercase font-bold">Network</p></div>
              </div>
            </div>

            {/* Platform Resource Distribution */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Resource Allocation</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[11px] text-purple-300 uppercase font-bold mb-2">
                      <span>Confirmed Bookings</span>
                      <span>{bookings.length > 0 ? Math.round((bookings.filter(b => b.status === "CONFIRMED").length / bookings.length) * 100) : 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: bookings.length > 0 ? `${(bookings.filter(b => b.status === "CONFIRMED").length / bookings.length) * 100}%` : "0%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-purple-300 uppercase font-bold mb-2">
                      <span>Pending Verification</span>
                      <span>{bookings.length > 0 ? Math.round((bookings.filter(b => b.status === "PENDING").length / bookings.length) * 100) : 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-orange-500 to-yellow-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ width: bookings.length > 0 ? `${(bookings.filter(b => b.status === "PENDING").length / bookings.length) * 100}%` : "0%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 italic">
                <p className="text-xs text-purple-200 leading-relaxed text-center">
                  "EventSphere Project Conclusion: Successfully integrated user authentication, scalable event logic, and real-time dashboard analytics."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard