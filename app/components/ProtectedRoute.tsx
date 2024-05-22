'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsAuthenticated(true)
      } else {
        router.push('/login')
      }
    }

    checkSession()
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute