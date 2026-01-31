'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api, Profile } from '@/lib/api'
import PortfolioContent from '@/components/PortfolioContent'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPortfolio, setShowPortfolio] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Try to fetch profile to see if user exists
        const data = await api.getProfile()

        if (data) {
          // Profile exists (Old User)
          setProfile(data)

          // 2. Check if logged in
          const isLoggedIn = localStorage.getItem('isLoggedIn')

          if (isLoggedIn === 'true') {
            // Authenticated -> Show Portfolio
            setShowPortfolio(true)
          } else {
            // Not Authenticated -> Redirect to Login
            router.push('/login')
            return;
          }
        } else {
          // Should ideally throw 404 if not found in my API logic, 
          // but if it returns null equivalent:
          router.push('/create-profile')
          return;
        }
      } catch (error) {
        // Failed to fetch profile (likely 404 or network error)
        // Assume New User -> Redirect to Create Profile
        console.log("No profile found or error, redirecting to create profile:", error)
        router.push('/create-profile')
        return;
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // If we are here and showPortfolio is false, we are likely redirecting, so return null or loader
  if (!showPortfolio) return null;

  return <PortfolioContent profile={profile} />
}
