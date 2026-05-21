import React from 'react'
import { useUserStore } from '../stores/useUserStore'
import LoadingSpinner from './loadingSpinner'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ allowedRole }) => {
    const { user } = useUserStore()

    if (!user) return <Navigate to='/login' replace />

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to='/' replace />
    }

    return <Outlet />
}

export default ProtectedRoute