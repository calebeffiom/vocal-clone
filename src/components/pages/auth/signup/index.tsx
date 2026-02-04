"use client"
import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'











export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const { data: session, status } = useSession();
  const router = useRouter()
  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn('google', {
        callbackUrl: '/latest-stories',
      })
    } catch (error) {
      console.log(error)
    }
  }






  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-50 via-white to-slate-100 grid place-items-center px-0 sm:px-4">
      <div className="w-full max-w-md">

        <div className="bg-white p-8 rounded-none sm:rounded-xl shadow-sm border border-slate-100">
          <button
            className="w-full flex items-center justify-center space-x-2 mb-6 bg-[#2E2E2E] text-white p-3 rounded-xl"
            onClick={handleSignIn}
          >
            {status === "loading" || isLoading ? (

              <svg className='w-[50px] h-[35px] animate-spin' viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.672"></g><g id="SVGRepo_iconCarrier"> <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="#ffff" strokeWidth="2.4" strokeLinecap="round"></path> </g></svg>


            ) : (
              <>
                <svg className="w-5 h-5 " viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg><span>Continue with Google</span></>
            )}
          </button>


          <div className="text-center mb-3">
            <h1 className="text-2xl font-bold text-primary mb-2">Welcome to Ink Labs</h1>
            <p className="text-slate-600">
              Join thousands of users who write blogs with us.
            </p>
          </div>
          <div className="text-left sm:text-center text-sm text-slate-500">
            <div className="space-y-2">
              <div className="flex items-center text-xs">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Get started now</span>
              </div>
              <div className="flex items-center text-xs">
                <span className="bg-green-100 p-1 rounded-full mr-2">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>Join 50,000+ users making a difference everyday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}