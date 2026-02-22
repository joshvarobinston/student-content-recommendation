// pages/LandingPage.jsx
// Landing page — shown to visitors before login

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/token'

const LandingPage = () => {
  const navigate = useNavigate()

  // If already logged in redirect to feed
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/feed')
    }
  }, [])

  const features = [
    { icon: '🎥', title: 'YouTube Videos', desc: 'Curated educational videos matched to your interests.' },
    { icon: '📰', title: 'News & Articles', desc: 'Stay updated with the latest news in your field.' },
    { icon: '📚', title: 'Books & Research', desc: 'Discover books and papers for your academic goals.' },
    { icon: '🤖', title: 'AI Powered', desc: 'Smart ML algorithm learns from your behavior.' },
  ]

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">
            S
          </div>
          <span className="font-heading font-bold text-xl">StudentReco</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mb-6 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          AI-Powered Content Recommendations
        </div>

        <h1 className="relative font-heading font-extrabold text-5xl md:text-7xl leading-tight mb-6 max-w-4xl">
          Discover Content
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Made For You
          </span>
        </h1>

        <p className="relative text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          StudentReco brings together YouTube videos, news articles, and research books —
          all personalized using real machine learning.
        </p>

        <div className="relative flex items-center gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            Get Started Free →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 font-semibold rounded-xl transition-all hover:-translate-y-0.5"
          >
            Login to Account
          </button>
        </div>

        {/* Stats */}
        <div className="relative mt-16 flex items-center gap-10 flex-wrap justify-center">
          {[
            { label: 'Content Sources', value: '3+' },
            { label: 'Interest Domains', value: '10+' },
            { label: 'ML Powered', value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-bold text-3xl">{stat.value}</div>
              <div className="text-white/40 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-3">
              Everything You Need to Learn
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              One platform. All your learning content. Personalized just for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-6 pb-24 border-t border-white/10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-3">How It Works</h2>
          <p className="text-white/50 text-base mb-14">Get personalized content in 3 simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with your email and password.' },
              { step: '02', title: 'Pick Interests', desc: 'Choose from 10+ domains like CS, Medical, Business.' },
              { step: '03', title: 'Get Recommendations', desc: 'Our ML algorithm serves personalized content instantly.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-heading font-bold text-indigo-400 text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-3xl p-12 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Start Learning Smarter Today
          </h2>
          <p className="text-white/60 text-base mb-8">
            Join StudentReco and get AI-powered content recommendations.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 font-semibold rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
          >
            Create Free Account →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-8 py-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center font-bold text-xs">S</div>
          <span className="font-heading font-semibold text-sm">StudentReco</span>
        </div>
        <p className="text-white/30 text-sm">© 2026 StudentReco. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default LandingPage