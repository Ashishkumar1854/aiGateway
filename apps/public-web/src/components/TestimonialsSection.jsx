const testimonials = [
  {
    name: 'Priya Sharma',
    company: 'GrowthStack Agency',
    role: 'Founder',
    review: 'AiGateway transformed our lead pipeline. We went from manually searching for prospects to having 500+ qualified leads delivered automatically every month.',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    company: 'TechBridge Solutions',
    role: 'Head of Sales',
    review: 'The email automation agent writes better outreach than most SDRs I have hired. And the human approval queue gives us complete control over what goes out.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    company: 'RecruitFast',
    role: 'Operations Manager',
    review: 'We use AiGateway for LinkedIn outreach and candidate sourcing. The time saved is incredible — our team focuses on interviews instead of prospecting.',
    rating: 5,
  },
  {
    name: 'Vikram Patel',
    company: 'PropConnect Realty',
    role: 'Director',
    review: 'The WhatsApp automation has been a game-changer for real estate. Instant follow-ups, broadcast campaigns, and CRM integration all in one place.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-5 sm:text-5xl tracking-tight">What our clients say</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Real results from real businesses using AiGateway automation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/60 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>

              {/* Review */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 italic">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
