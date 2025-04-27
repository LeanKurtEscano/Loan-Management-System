import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query' 
import { fetchNotificationsPage } from '../utils/notification'
import { 
  Bell, 
  Check, 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Clock,
  AlertCircle
} from 'lucide-react'

const NotificationPage = () => {
  // State management
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Set to exactly 5 items per page
  
  // Fetch data
  const { data, isLoading, isError } = useQuery(["userNotifications"], fetchNotificationsPage)
  
  // Mock additional notifications if data exists but has fewer than 10 items
  const enhancedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return []
    
 
  
    return data
  }, [data])
  
  // Filter notifications based on active filter and search query
  const filteredNotifications = enhancedData ? enhancedData.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeFilter === 'all') return matchesSearch
    if (activeFilter === 'unread') return !notification.is_read && matchesSearch
    if (activeFilter === 'approved') return notification.status === 'Success' && matchesSearch
    if (activeFilter === 'rejected') return notification.status === 'Rejected' && matchesSearch
    
    return matchesSearch
  }) : []
  
  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNotifications = filteredNotifications.slice(startIndex, endIndex)
  
  // Generate pagination numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if at edges
      if (currentPage <= 2) {
        endPage = 4
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...')
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }
  
  // Format the timestamp to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  // Get appropriate icon based on notification status
  const getNotificationIcon = (status) => {
    switch(status) {
      case 'Success':
        return <Check className="text-green-500" size={20} />
      case 'Rejected':
        return <X className="text-red-500" size={20} />
      default:
        return <AlertCircle className="text-blue-500" size={20} />
    }
  }

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'Success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }
  
  // Simplified filter options
  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center bg-white border-b">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="text-blue-600" size={20} />
            Notifications
          </h1>
          
          <div className="flex items-center">
            <div className="flex space-x-1">
              {filterOptions.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setActiveFilter(filter.value)
                    setCurrentPage(1)
                  }}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                    activeFilter === filter.value 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      
        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search notifications"
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>
      
        {/* Notification List */}
        <div>
          {isLoading && (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          )}
          
          {isError && (
            <div className="text-center py-16">
              <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
              <p className="text-gray-800 font-medium">Failed to load notifications</p>
            </div>
          )}
          
          {!isLoading && !isError && filteredNotifications.length === 0 && (
            <div className="text-center py-16">
              <Bell size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}
          
          {!isLoading && !isError && currentNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                  notification.status === 'Success' ? 'bg-green-100' : 
                  notification.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {getNotificationIcon(notification.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className={`${!notification.is_read ? 'font-medium' : ''} text-gray-800`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex ml-4">
                      {!notification.is_read && (
                        <span className="h-2 w-2 bg-blue-600 rounded-full mt-2"></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-1 gap-3">
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                    
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeStyle(notification.status)}`}>
                      {notification.status}
                    </span>
                    
                    {notification.status === 'Rejected' && (
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                        Try again
                      </button>
                    )}
                  </div>
                </div>
                
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {!isLoading && !isError && filteredNotifications.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredNotifications.length)} of {filteredNotifications.length}
            </span>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronLeft size={16} />
              </button>
              
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`
                    px-3 py-1 rounded
                    ${typeof page !== 'number' 
                      ? 'cursor-default' 
                      : page === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 rounded ${currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationPage