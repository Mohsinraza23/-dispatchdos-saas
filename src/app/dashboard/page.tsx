import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PLAN_LIMITS: Record<string, number> = {
  free: 30,
  starter: 500,
  pro: Infinity,
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ upgraded?: string }> }) {
  const params = await searchParams
  const justUpgraded = params.upgraded === '1'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token ?? ''

  // Get user profile + usage
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan || 'free'
  const usedLookups = profile?.lookups_used_this_month || 0
  const limit = PLAN_LIMITS[plan]
  const usedPct = limit === Infinity ? 0 : Math.round((usedLookups / limit) * 100)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="bg-[#020617] border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-black text-white tracking-tight">
          Dispatch<span className="text-amber-400">DOS</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{user.email}</span>
          <form action="/api/auth/logout" method="POST">
            <button className="text-slate-400 hover:text-white text-sm transition">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Upgrade success banner */}
        {justUpgraded && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-bold text-green-800">Plan upgraded successfully!</p>
              <p className="text-green-600 text-sm">Your new lookup limit is active right now.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-slate-500 mt-1">Manage your carrier verification account</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Plan card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Plan</p>
            <p className="text-3xl font-black text-slate-900">{PLAN_LABELS[plan]}</p>
            {plan === 'free' && (
              <Link href="/pricing" className="inline-block mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700">
                Upgrade →
              </Link>
            )}
          </div>

          {/* Usage card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lookups This Month</p>
            <p className="text-3xl font-black text-slate-900">
              {usedLookups}
              <span className="text-lg text-slate-400 font-medium">
                /{limit === Infinity ? '∞' : limit}
              </span>
            </p>
            {limit !== Infinity && (
              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${usedPct > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(usedPct, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Status card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xl font-bold text-green-600">Active</p>
            </div>
            <p className="text-xs text-slate-400 mt-2">{user.email}</p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="bg-gradient-to-br from-[#020617] to-[#0f1f4a] rounded-2xl p-8 text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">
              Start Verifying Carriers
            </h2>
            <p className="text-slate-400 mb-6 max-w-lg">
              Bulk carrier verification with AI risk scoring. Upload your list and get results in minutes.
            </p>
            {(limit === Infinity || usedLookups < limit) ? (
              <a
                href={`${process.env.STREAMLIT_APP_URL || 'https://dispatchdosgitmohsin.streamlit.app'}?token=${accessToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/25"
              >
                Open DispatchDOS Tool →
              </a>
            ) : (
              <div>
                <p className="text-amber-400 font-semibold mb-3">
                  You&apos;ve used all {limit} lookups this month.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                  Upgrade Plan →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade banner for free users */}
        {plan === 'free' && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-bold text-blue-900">Get more lookups with Starter</p>
              <p className="text-blue-600 text-sm mt-1">500 lookups/month for just $19 — upgrade anytime</p>
            </div>
            <Link
              href="/pricing"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
