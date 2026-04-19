import React, { useState } from 'react';

const Membership = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const plans = [
    {
      name: "Iron Basic",
      price: "999",
      features: ["Standard Equipment Access", "Locker Room", "Free Wi-Fi", "1 Group Class/Month"],
      recommended: false,
    },
    {
      name: "Beast Mode",
      price: "1999",
      features: ["24/7 Gym Access", "Diet Plan Included", "All Group Classes", "Personal Locker"],
      recommended: true,
    },
    {
      name: "God Tier",
      price: "3499",
      features: ["Personal Trainer (3 days/wk)", "Massage & Spa", "Premium Supplements", "VIP Parking"],
      recommended: false,
    }
  ];

  const faqs = [
    { q: "Can I upgrade my plan later?", a: "Yes, you can upgrade your membership at any time by paying the prorated difference for the current month." },
    { q: "Are there any joining fees?", a: "No! We believe in transparency. What you see is what you pay. Zero hidden charges." },
    { q: "Can I freeze my membership?", a: "Beast Mode and God Tier members can freeze their membership for up to 30 days once a year." },
    { q: "Is personal training included?", a: "Personal training is included in the God Tier plan. For other plans, it can be added as a separate package." }
  ];

  return (
    <div 
      className="min-h-screen text-white pb-20 font-sans bg-no-repeat bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.50)), url('/image_29ab2d.jpg')` 
      }}
    >
      
      {/* 1. Header & Pricing Cards Section */}
      <section id="plans" className="pt-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 pt-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg mb-4">
              CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">PLAN</span>
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto drop-shadow-md">
              No hidden fees. Just pure gains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative flex flex-col group transition-all duration-500 hover:-translate-y-4 backdrop-blur-md ${
                  plan.recommended 
                  ? 'bg-zinc-900/60 border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.2)] transform md:-translate-y-4' 
                  : 'bg-black/60 border border-zinc-700/50 hover:border-zinc-500'
                } p-8 rounded-3xl`}
              >
                {plan.recommended && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-700 text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-3xl font-black italic uppercase text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-orange-500 drop-shadow-md">₹{plan.price}</span>
                    <span className="text-gray-400 font-bold">/mo</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-200 font-medium">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* YAHAN SE SELECT PLAN WALA BUTTON HATA DIYA GAYA HAI */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Detailed Comparison Table */}
      <section id="compare" className="py-20 px-4 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-5xl mx-auto relative z-10">
          <h3 className="text-3xl md:text-5xl font-black italic uppercase text-center mb-12 drop-shadow-lg">
            Compare <span className="text-orange-500">Features</span>
          </h3>
          <div className="overflow-x-auto rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-gray-400 font-bold uppercase tracking-wider">Features</th>
                  <th className="p-4 text-center font-black text-white text-xl">Iron Basic</th>
                  <th className="p-4 text-center font-black text-orange-500 text-xl">Beast Mode</th>
                  <th className="p-4 text-center font-black text-white text-xl">God Tier</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  { name: "Cardio & Weights Access", basic: true, beast: true, god: true },
                  { name: "24/7 Access", basic: false, beast: true, god: true },
                  { name: "Group Classes", basic: "1/Month", beast: "Unlimited", god: "Unlimited" },
                  { name: "Custom Diet Plan", basic: false, beast: true, god: true },
                  { name: "Personal Trainer", basic: false, beast: false, god: "3 Days/Wk" },
                  { name: "Spa & Recovery Area", basic: false, beast: false, god: true },
                  { name: "Free Supplements", basic: false, beast: false, god: "Monthly Kit" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{row.name}</td>
                    <td className="p-4 text-center">
                      {typeof row.basic === 'boolean' ? (row.basic ? '✔️' : '❌') : <span className="font-bold">{row.basic}</span>}
                    </td>
                    <td className="p-4 text-center bg-orange-500/10">
                      {typeof row.beast === 'boolean' ? (row.beast ? '✔️' : '❌') : <span className="font-bold text-orange-400">{row.beast}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.god === 'boolean' ? (row.god ? '✔️' : '❌') : <span className="font-bold">{row.god}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Premium Perks */}
      <section id="perks" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-black italic uppercase text-center mb-16 drop-shadow-lg">
            The NR Fitness <span className="text-orange-500">Advantage</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🏋️‍♂️", title: "Imported Machines", desc: "Top of the line bio-mechanically perfect equipment." },
              { icon: "🧊", title: "Ice Baths & Sauna", desc: "Premium recovery zone to heal your muscles faster." },
              { icon: "📊", title: "InBody Scans", desc: "Track your muscle gain and fat loss scientifically." },
              { icon: "🎵", title: "DJ & Vibe", desc: "Hardcore sound system to keep your adrenaline pumping." }
            ].map((perk, i) => (
              <div key={i} className="p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">{perk.icon}</div>
                <h4 className="font-bold text-lg mb-2 text-white">{perk.title}</h4>
                <p className="text-gray-400 text-sm">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-3xl mx-auto relative z-10">
          <h3 className="text-3xl md:text-4xl font-black italic uppercase text-center mb-10 drop-shadow-lg">
            Got <span className="text-orange-500">Questions?</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span className="font-bold text-lg text-white">{faq.q}</span>
                  <span className={`text-orange-500 text-2xl transition-transform duration-300 ${activeFaq === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Membership;