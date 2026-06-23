import Link from 'next/link'

export const metadata = {
  title: 'Login — AiGateway',
  description: 'Login to your AiGateway client dashboard.',
}

export default function LoginPage() {
  const dashboardURL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-600 font-black">⚡</span>
            AiGateway
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Client Dashboard</h1>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-light">
            Access your AiGateway dashboard to manage services, view leads, and track automation results.
          </p>

          <a
            href={`${dashboardURL}/login`}
            className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5"
          >
            Go to Dashboard Login →
          </a>

          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <p className="text-[11px] text-slate-500 font-medium">Don&apos;t have an account yet?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact?type=trial"
                className="flex-1 rounded-xl border border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition-all text-center"
              >
                Start Free Trial
              </Link>
              <Link
                href="/book-demo"
                className="flex-1 rounded-xl border border-slate-200 hover:border-slate-350 bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition-all text-center"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
