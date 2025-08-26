'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState('gallery')

  const tabs = [
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'board-members', label: 'Board Members', icon: '👥' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Rotary Club Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your club's content</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="px-6 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Rotary Club of Gudalur Garden City - Admin Dashboard
          </p>
        </div>
      </footer>
    </div>
  )
}

// Usage example component
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('gallery')

  const renderContent = () => {
    switch (activeTab) {
      case 'gallery':
        // Import and return GalleryAdmin component
        return <div>Gallery Admin Component</div>
      case 'events':
        // Import and return EventsAdmin component  
        return <div>Events Admin Component</div>
      case 'board-members':
        // Import and return BoardMembersAdmin component
        return <div>Board Members Admin Component</div>
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4 mb-6">
              <Button 
                variant={activeTab === 'gallery' ? 'default' : 'outline'}
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </Button>
              <Button 
                variant={activeTab === 'events' ? 'default' : 'outline'}
                onClick={() => setActiveTab('events')}
              >
                Events
              </Button>
              <Button 
                variant={activeTab === 'board-members' ? 'default' : 'outline'}
                onClick={() => setActiveTab('board-members')}
              >
                Board Members
              </Button>
            </div>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}