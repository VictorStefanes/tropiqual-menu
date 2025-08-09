'use client'

import React from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import AdminDashboard from '../../components/AdminDashboard'

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="staff">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
