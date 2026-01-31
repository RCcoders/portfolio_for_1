'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Github, Linkedin, Mail, FileText } from 'lucide-react'
import { api } from '@/lib/api'
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileName, setProfileName] = useState('Raghav Chawla') // Default fallback
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/RCcoders', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/raghav-chawla-29255b275', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:chawlaraghav78@gmail.com', label: 'Email' },
    { icon: FileText, href: '/pdfs/resume.pdf', label: 'Resume' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') { return true }
    if (path !== '/' && pathname.startsWith(path)) { return true }
    return false
  }

  useEffect(() => {
    // Check login status and fetch profile
    const checkLogin = async () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        try {
          const profile = await api.getProfile()
          if (profile?.name) {
            setProfileName(profile.name)
          }
        } catch (error) {
          console.error('Failed to fetch profile name', error)
        }
      }
    }
    checkLogin()

    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    window.location.href = '/login'
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 py-2'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="relative group">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-green-500 rounded-lg rotate-0 group-hover:rotate-12 transition-transform duration-300 opacity-75 blur-sm"></div>
                  <div className="relative w-full h-full bg-black rounded-lg border border-white/10 flex items-center justify-center font-bold text-white z-10">
                    RC
                  </div>
                </div>
                <span className="font-bold text-xl tracking-tight text-white hidden sm:block group-hover:text-primary transition-colors">
                  {profileName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(item.href)
                    ? 'text-white bg-white/10 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Social Links & Logout */}
            <div className="hidden lg:flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-medium hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 min-h-screen">
            <div className="px-4 py-8 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-sky-600/20 to-green-600/20 border border-sky-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-4 rounded-xl text-lg font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  Logout
                </button>
              )}

              {/* Mobile Social Links */}
              <div className="flex items-center justify-center space-x-6 pt-8 mt-8 border-t border-white/10">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="p-4 text-gray-400 hover:text-white bg-white/5 rounded-full transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
