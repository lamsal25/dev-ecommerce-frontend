
'use client'
import axios from 'axios'
import { useEffect } from 'react'

export const CsrfProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/setcsrf/`, 
          { 
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
            }
          }
        )
        
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }
    
    fetchCsrfToken()
  }, []) // Empty dependency array = runs once on mount

  return <>{children}</>
}
