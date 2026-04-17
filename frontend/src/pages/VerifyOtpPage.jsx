import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getProfile } from '../api/accountApi'
import { resendOtp, verifyOtp } from '../api/authApi'
import { clearPendingOtp, getPendingOtp, saveTokens } from '../utils/token'

const VerifyOtpPage = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const pendingOtp = getPendingOtp()

  useEffect(() => {
    if (!pendingOtp?.email || pendingOtp?.purpose !== 'signin') {
      navigate('/login', { replace: true })
    }
  }, [navigate, pendingOtp])

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!otp) {
      toast.error('Please enter the OTP code')
      return
    }

    setLoading(true)
    try {
      const response = await verifyOtp({
        email: pendingOtp.email,
        otp,
        purpose: pendingOtp.purpose,
      })

      saveTokens(response.data.access, response.data.refresh)
      clearPendingOtp()

      const profileResponse = await getProfile()
      const hasInterests = profileResponse.data.interests?.length > 0

      toast.success('OTP verified successfully!')
      navigate(hasInterests ? '/feed' : '/interests')
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Invalid OTP. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await resendOtp({
        email: pendingOtp.email,
        purpose: pendingOtp.purpose,
      })
      toast.success('A new OTP has been sent to your email.')
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Unable to resend OTP right now.'
      toast.error(message)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white">
            S
          </div>
          <span className="font-heading font-bold text-2xl text-white">StudentReco</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="font-heading font-bold text-2xl text-white mb-1">Verify Your Email</h2>
          <p className="text-white/50 text-sm mb-6">
            Enter the OTP sent to <span className="text-white">{pendingOtp?.email}</span> to finish signing in.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block">OTP Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm tracking-[0.3em] placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all mt-2"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>

            <Link to="/login" className="text-white/40 hover:text-white/70">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtpPage
