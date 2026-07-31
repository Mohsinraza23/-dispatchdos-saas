import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    pkr: 0,
    lookups: 30,
    features: ['30 lookups / month', '30+ carrier data points', 'Risk score per carrier', 'Excel export'],
    missing: ['Authority alerts', 'PDF reports', 'Canada carriers'],
    cta: 'Get Started Free',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Starter',
    price: 19,
    pkr: 5300,
    lookups: 500,
    features: ['500 lookups / month', '30+ carrier data points', 'Risk score per carrier', 'Excel + PDF export', 'Authority change alerts', 'Canada carriers'],
    missing: ['API access'],
    cta: 'Get Starter',
    href: '/api/checkout?plan=starter',
    popular: true,
  },
  {
    name: 'Pro',
    price: 49,
    pkr: 13700,
    lookups: Infinity,
    features: ['Unlimited lookups', '30+ carrier data points', 'Risk score per carrier', 'Excel + PDF export', 'Authority change alerts', 'Canada carriers', 'API access'],
    missing: [],
    cta: 'Get Pro',
    href: '/api/checkout?plan=pro',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="bg-[#020617] border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-white tracking-tight">
          Dispatch<span className="text-amber-400">DOS</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-slate-400 hover:text-white text-sm transition">Sign in</Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
            Start Free
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-slate-500 text-lg">Start free. Upgrade when you need more. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-8 relative ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl shadow-blue-100 scale-105'
                  : 'border border-slate-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  MOST POPULAR
                </div>
              )}

              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{plan.name}</p>
              <div className="mb-1">
                <span className="text-slate-400 text-lg font-semibold">$</span>
                <span className="text-5xl font-black text-slate-900 tracking-tight">{plan.price}</span>
                <span className="text-slate-400 text-sm ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                {plan.price === 0 ? 'PKR 0' : `~PKR ${plan.pkr.toLocaleString()}`} / month
              </p>
              <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
                {plan.lookups === Infinity ? 'Unlimited' : plan.lookups} carrier lookups / month
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <span className="w-4 h-4 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block text-center font-semibold py-3 rounded-xl transition text-sm ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-indigo-500'
                    : 'border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          Pakistan-based users: Bank transfer, Easypaisa, and JazzCash accepted.{' '}
          <a href="mailto:hello@dispatchdos.com" className="text-blue-500 hover:text-blue-600">
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}
