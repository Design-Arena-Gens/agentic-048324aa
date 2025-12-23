'use client'

import { useState, useEffect } from 'react'
import { Phone, PhoneCall, PhoneOff, Clock, User, Calendar, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

type CallStatus = 'incoming' | 'active' | 'completed' | 'missed' | 'scheduled'

interface Call {
  id: string
  caller: string
  phone: string
  status: CallStatus
  duration?: number
  timestamp: Date
  notes?: string
  priority: 'low' | 'medium' | 'high'
}

export default function CallManagementAgent() {
  const [calls, setCalls] = useState<Call[]>([])
  const [activeCall, setActiveCall] = useState<Call | null>(null)
  const [filter, setFilter] = useState<CallStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [callTimer, setCallTimer] = useState(0)

  useEffect(() => {
    // Initialize with sample data
    const sampleCalls: Call[] = [
      {
        id: '1',
        caller: 'John Smith',
        phone: '+1 (555) 123-4567',
        status: 'completed',
        duration: 324,
        timestamp: new Date(Date.now() - 3600000),
        notes: 'Discussed project requirements',
        priority: 'high'
      },
      {
        id: '2',
        caller: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        status: 'missed',
        timestamp: new Date(Date.now() - 7200000),
        priority: 'medium'
      },
      {
        id: '3',
        caller: 'Mike Wilson',
        phone: '+1 (555) 456-7890',
        status: 'scheduled',
        timestamp: new Date(Date.now() + 3600000),
        notes: 'Follow-up call scheduled',
        priority: 'low'
      }
    ]
    setCalls(sampleCalls)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCall) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeCall])

  const handleIncomingCall = () => {
    const newCall: Call = {
      id: Date.now().toString(),
      caller: `Caller ${Math.floor(Math.random() * 1000)}`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: 'incoming',
      timestamp: new Date(),
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    }
    setCalls(prev => [newCall, ...prev])
  }

  const answerCall = (call: Call) => {
    setActiveCall(call)
    setCallTimer(0)
    setCalls(prev => prev.map(c =>
      c.id === call.id ? { ...c, status: 'active' } : c
    ))
  }

  const endCall = () => {
    if (activeCall) {
      setCalls(prev => prev.map(c =>
        c.id === activeCall.id
          ? { ...c, status: 'completed', duration: callTimer }
          : c
      ))
      setActiveCall(null)
      setCallTimer(0)
    }
  }

  const rejectCall = (callId: string) => {
    setCalls(prev => prev.map(c =>
      c.id === callId ? { ...c, status: 'missed' } : c
    ))
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: CallStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'missed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'active':
        return <PhoneCall className="w-5 h-5 text-blue-500 animate-pulse" />
      case 'incoming':
        return <Phone className="w-5 h-5 text-yellow-500 animate-bounce" />
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-purple-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCalls = calls.filter(call => {
    const matchesFilter = filter === 'all' || call.status === filter
    const matchesSearch = call.caller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.phone.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.status === 'completed').length,
    missed: calls.filter(c => c.status === 'missed').length,
    scheduled: calls.filter(c => c.status === 'scheduled').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Phone className="w-8 h-8 text-indigo-600" />
                Call Management Agent
              </h1>
              <p className="text-gray-600 mt-2">AI-powered intelligent call handling system</p>
            </div>
            <button
              onClick={handleIncomingCall}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Simulate Incoming Call
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Calls</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.missed}</div>
              <div className="text-sm text-gray-600">Missed</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </div>

        {/* Active Call Widget */}
        {activeCall && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">Active Call</div>
                <div className="text-2xl font-bold">{activeCall.caller}</div>
                <div className="text-sm opacity-90 mt-1">{activeCall.phone}</div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{formatDuration(callTimer)}</div>
              </div>
              <button
                onClick={endCall}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <PhoneOff className="w-5 h-5" />
                End Call
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'incoming', 'active', 'completed', 'missed', 'scheduled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as CallStatus | 'all')}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calls List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Call History ({filteredCalls.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCalls.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No calls found matching your criteria</p>
              </div>
            ) : (
              filteredCalls.map((call) => (
                <div key={call.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(call.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-gray-800">{call.caller}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(call.priority)}`}>
                            {call.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{call.phone}</div>
                        {call.notes && (
                          <div className="text-sm text-gray-500 mt-1 italic">{call.notes}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatTimestamp(call.timestamp)}
                        </div>
                        {call.duration !== undefined && (
                          <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(call.duration)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-6 flex gap-2">
                      {call.status === 'incoming' && (
                        <>
                          <button
                            onClick={() => answerCall(call)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <PhoneCall className="w-4 h-4" />
                            Answer
                          </button>
                          <button
                            onClick={() => rejectCall(call.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <PhoneOff className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
