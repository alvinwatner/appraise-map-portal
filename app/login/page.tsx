'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import logo from '/public/logo.png' // Pastikan Anda memiliki logo ini di folder public

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/maps')
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push('/maps')
    }
  }

  return (
    <>
      <nav className="py-3 shadow-md">
        <div className="container mx-auto px-3 flex justify-between items-center">
          <Link href="/">
            <div className="text-grey-100 hover:text-grey-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={48} d="M244 400L100 256l144-144M120 256h292">
                </path>
              </svg>
              &nbsp; Back
            </div>
          </Link>
        </div>
      </nav>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow">
          <div className="text-center" >
            <Image src={logo} alt="Logo" width={80} height={80} />
            <h5 className="mt-3 text-l font-bold">GRAHA PARAMITA KONSULTAN</h5>
            <p className="mt-7 text-lg">Log in</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="text-l">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label htmlFor="password" className="mb-1 text-s">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 1024 1024">
                        <path fill="currentColor" d="M508 624a112 112 0 0 0 112-112c0-3.28-.15-6.53-.43-9.74L498.26 623.57c3.21.28 6.45.43 9.74.43m370.72-458.44L836 122.88a8 8 0 0 0-11.31 0L715.37 232.23Q624.91 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.7 119.43 136.55 191.45L112.56 835a8 8 0 0 0 0 11.31L155.25 889a8 8 0 0 0 11.31 0l712.16-712.12a8 8 0 0 0 0-11.32M332 512a176 176 0 0 1 258.88-155.28l-48.62 48.62a112.08 112.08 0 0 0-140.92 140.92l-48.62 48.62A175.1 175.1 0 0 1 332 512" />
                        <path fill="currentColor" d="M942.2 486.2Q889.4 375 816.51 304.85L672.37 449A176.08 176.08 0 0 1 445 676.37L322.74 798.63Q407.82 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5" />
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 14 14">
                        <path fill="currentColor" fillRule="evenodd" d="M2.933 3.491C4.056 2.681 5.456 2 7 2s2.944.682 4.067 1.491c1.128.812 2.02 1.784 2.56 2.437l.005.005c.241.3.368.681.368 1.067c0 .386-.127.766-.368 1.067l-.005.005c-.54.653-1.432 1.625-2.56 2.437C9.944 11.32 8.544 12 7 12s-2.944-.682-4.067-1.49C1.805 9.696.913 8.724.373 8.071l-.005-.005A1.7 1.7 0 0 1 0 7c0-.386.127-.766.368-1.067l.005-.005c.54-.653 1.432-1.625 2.56-2.437M7 9.25a2.25 2.25 0 1 0 0-4.5a2.25 2.25 0 0 0 0 4.5" clipRule="evenodd" />
                      </svg>}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
