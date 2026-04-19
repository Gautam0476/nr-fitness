import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Auth from './Auth';
import Membership from './membership';
import DemoForm from './DemoForm';
import CustomCursor from './CustomCursor';
import API_BASE_URL from './api';
import StatusPopup from './StatusPopup';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const isValidPhone = (phone) => phone.replace(/\D/g, '').length >= 10;

const Navbar = ({ onLogout, currentPage, setCurrentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent transition-all pt-4">
      <div className="max-w-full mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => handleNav('home')}>
            <svg className="w-8 h-8 text-orange-500 drop-shadow-md transform -rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43 1.43-1.43-1.43-1.43z" />
            </svg>
            <h1 className="text-3xl font-black text-white italic tracking-wider drop-shadow-md">
              NR<span className="text-orange-500">FITNESS</span>
            </h1>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => handleNav('home')} className={`${currentPage === 'home' ? 'text-orange-500' : 'text-gray-100'} hover:text-orange-500 px-3 py-2 text-sm font-bold transition drop-shadow-md`}>Home</button>
              <button onClick={() => handleNav('about')} className={`${currentPage === 'about' ? 'text-orange-500' : 'text-gray-100'} hover:text-orange-500 px-3 py-2 text-sm font-bold transition drop-shadow-md`}>About Us</button>
              <button onClick={() => handleNav('plans')} className={`${currentPage === 'plans' ? 'text-orange-500' : 'text-gray-100'} hover:text-orange-500 px-3 py-2 text-sm font-bold transition drop-shadow-md`}>Plans</button>
              <button onClick={() => handleNav('contact')} className={`${currentPage === 'contact' ? 'text-orange-500' : 'text-gray-100'} hover:text-orange-500 px-3 py-2 text-sm font-bold transition drop-shadow-md`}>Contact Us</button>

              <button onClick={onLogout} className="bg-zinc-800/80 backdrop-blur-sm hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all border border-zinc-700">
                Logout
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-orange-500 hover:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-zinc-800 bg-black/90 backdrop-blur-sm shadow-2xl overflow-hidden">
            <button onClick={() => handleNav('home')} className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${currentPage === 'home' ? 'text-orange-500 bg-zinc-900/80' : 'text-gray-100 hover:bg-zinc-900/80 hover:text-orange-500'}`}>Home</button>
            <button onClick={() => handleNav('about')} className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${currentPage === 'about' ? 'text-orange-500 bg-zinc-900/80' : 'text-gray-100 hover:bg-zinc-900/80 hover:text-orange-500'}`}>About Us</button>
            <button onClick={() => handleNav('plans')} className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${currentPage === 'plans' ? 'text-orange-500 bg-zinc-900/80' : 'text-gray-100 hover:bg-zinc-900/80 hover:text-orange-500'}`}>Plans</button>
            <button onClick={() => handleNav('contact')} className={`block w-full px-4 py-3 text-left text-sm font-bold transition ${currentPage === 'contact' ? 'text-orange-500 bg-zinc-900/80' : 'text-gray-100 hover:bg-zinc-900/80 hover:text-orange-500'}`}>Contact Us</button>
            <button onClick={onLogout} className="block w-full border-t border-zinc-800 px-4 py-3 text-left text-sm font-bold text-white transition hover:bg-red-600">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative flex content-center items-center justify-center min-h-screen">
      <div className="container relative mx-auto text-center px-4 mt-20">
        <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg mb-4">
          UNLEASH YOUR <br /><span className="text-orange-500">TRUE POTENTIAL</span>
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto drop-shadow-md">
          Join a community of individuals dedicated to pushing limits. Your ultimate transformation starts right here.
        </p>
      </div>
    </div>
  );
};

const JoinModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Per person 1 month - 1500/-',
    comments: ''
  });
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!status.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setStatus({ message: '', type: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [status]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email) || !isValidPhone(formData.phone)) {
      setStatus({
        message: 'Invalid details. Please enter a valid email and phone number.',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: 'Registration save ho rahi hai...', type: 'info' });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/register-membership`, formData);
      setStatus({
        message: response.data.message || 'Registration completed successfully!',
        type: 'success'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        plan: 'Per person 1 month - 1500/-',
        comments: ''
      });
    } catch (error) {
      console.error('Membership registration error:', error);
      setStatus({
        message: error.response?.data?.error || 'Invalid details. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <StatusPopup status={status} onClose={() => setStatus({ message: '', type: '' })} />
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black italic uppercase text-white mb-2 tracking-tight">
            START YOUR <span className="text-orange-500">TRANSFORMATION</span>
          </h2>
          <p className="text-zinc-400 text-sm">
            Fill in your details and our team will contact you shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                required
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Select Plan</label>
            <div className="relative">
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
              >
                <option>Per person 1 month - 1500/-</option>
                <option>Per person 3 months - 4000/-</option>
                <option>Per person 6 months - 7500/-</option>
                <option>Per person 1 year - 14000/-</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Review or Comments</label>
            <textarea
              rows="3"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Any specific goals?"
              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors placeholder-zinc-600 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white font-black uppercase tracking-widest py-4 rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-4 shadow-lg"
          >
            {isSubmitting ? 'SAVING...' : 'COMPLETE REGISTRATION'}
          </button>
        </form>
      </div>
    </div>
  );
};

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      className="py-32 flex items-center justify-center min-h-[80vh] bg-no-repeat bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/image_51fe84.jpg')" }}
    >
      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <h3 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic drop-shadow-2xl">
          ABOUT <span className="text-orange-500">US</span>
        </h3>

        <p className="text-lg md:text-xl font-light leading-relaxed mt-4 mb-12 text-gray-200 max-w-2xl mx-auto drop-shadow-lg">
          NR Fitness is built for people who want strength, discipline, and transformation inside the gym and far beyond it.
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
          <div className="border-l-4 border-orange-500 pl-4 bg-black/50 backdrop-blur-sm py-4 pr-10 rounded-r-xl text-left shadow-2xl border border-white/5">
            <h4 className="text-3xl font-black text-white drop-shadow-md">50+</h4>
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mt-1">Equipments</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4 bg-black/50 backdrop-blur-sm py-4 pr-10 rounded-r-xl text-left shadow-2xl border border-white/5">
            <h4 className="text-3xl font-black text-white drop-shadow-md">24/7</h4>
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mt-1">Gym Access</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-black hover:bg-orange-600 transition-colors font-black uppercase tracking-[0.2em] px-8 py-4 text-sm md:text-base shadow-[0_0_20px_rgba(249,115,22,0.3)] mt-4"
        >
          JOIN THE MOVEMENT
        </button>
      </div>

      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

const WhyChooseUs = () => {
  return (
    <section
      className="py-24 bg-no-repeat bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url('/image_51fe84.jpg')" }}
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-xs tracking-[0.3em] uppercase mb-4">
            WHY NR FITNESS
          </p>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-lg">
            WHY CHOOSE <span className="text-orange-500">US</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Four pillars that set NR Fitness apart from every other gym in the city.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300 group shadow-2xl">
            <div className="w-12 h-12 rounded-lg border border-orange-500/50 flex items-center justify-center mb-6 bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white uppercase mb-4 tracking-wide">Expert Trainers</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every coach at NR Fitness holds international certification. No rookies, no guesswork, only science-backed coaching.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300 group shadow-2xl">
            <div className="w-12 h-12 rounded-lg border border-orange-500/50 flex items-center justify-center mb-6 bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white uppercase mb-4 tracking-wide">Advanced Equipment</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Commercial-grade machines, Olympic platforms, cable systems, and a dedicated turf zone.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300 group shadow-2xl">
            <div className="w-12 h-12 rounded-lg border border-orange-500/50 flex items-center justify-center mb-6 bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white uppercase mb-4 tracking-wide">Custom Workout Plans</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every member gets a personalised plan built around their goals, lifestyle, and consistency level.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300 group shadow-2xl">
            <div className="w-12 h-12 rounded-lg border border-orange-500/50 flex items-center justify-center mb-6 bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white uppercase mb-4 tracking-wide">24 / 7 Support</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Questions at midnight? Our coaching team stays reachable when members need help.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactUs = () => {
  return (
    <div
      className="text-white min-h-screen bg-no-repeat bg-cover bg-center bg-fixed pb-20"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop')" }}
    >
      <div className="relative pt-48 pb-16 flex items-center justify-center">
        <h1 className="relative text-6xl md:text-8xl font-black italic uppercase text-orange-500 drop-shadow-2xl">
          CONTACT US
        </h1>
      </div>

      <section className="px-4 md:px-10 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-orange-500"></div>
                <h2 className="text-4xl font-black uppercase italic">Our Details</h2>
              </div>
              <p className="text-gray-400">
                Visit our gym or give us a call.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-orange-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-orange-500 text-2xl pt-1">📍</span>
                  <div>
                    <h4 className="text-orange-500 font-black uppercase tracking-widest text-sm mb-1">Address & Pincode</h4>
                    <p className="text-white font-bold text-lg">Shop No. 12, Fitness Street, Near Main Market</p>
                    <p className="text-white font-bold text-lg">Jaipur, Rajasthan - 302021</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-orange-500/50 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-orange-500 text-2xl pt-1">📞</span>
                  <div>
                    <h4 className="text-orange-500 font-black uppercase tracking-widest text-sm mb-1">Phone Number</h4>
                    <p className="text-white font-bold text-lg">+91 97837 79797</p>
                  </div>
                </div>
                <div className="ml-10">
                  <h4 className="text-orange-500 font-black uppercase tracking-widest text-sm mb-1">Other Details</h4>
                  <p className="text-gray-300 font-bold uppercase text-xs mb-1">Instagram Page - <span className="text-white">nr_fitness_club</span></p>
                  <p className="text-gray-300 font-bold uppercase text-xs">Gmail ID - <span className="text-white">nrfitnessclub@gmail.com</span></p>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-orange-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-orange-500 text-2xl pt-1">🕒</span>
                  <div>
                    <h4 className="text-orange-500 font-black uppercase tracking-widest text-sm mb-1">Gym Timings</h4>
                    <p className="text-gray-300 font-bold">Morning Mon - Sat: <span className="text-white">06:00 AM - 12:00 PM</span></p>
                    <p className="text-gray-300 font-bold">Evening Mon - Sat: <span className="text-white">05:30 PM - 11:00 PM</span></p>
                    <p className="text-gray-300 font-bold">Sunday: <span className="text-red-500">Closed</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-4 mt-12 lg:mt-0">
            <div className="h-full min-h-[400px] rounded-3xl overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black/50">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56934.3314051662!2d75.723145!3d26.912433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4487b7a6697%3A0x67396a8f110c732!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  if (!isLoggedIn) {
    return <Auth onLogin={(user) => {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="font-sans bg-black text-white min-h-screen cursor-none [&_*]:cursor-none">
      <CustomCursor />

      <Navbar
        onLogout={() => {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {currentPage === 'home' && (
        <div
          className="bg-no-repeat bg-cover bg-center bg-fixed pb-10"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1475&auto=format&fit=crop')" }}
        >
          <Hero />
          <DemoForm />
        </div>
      )}

      {currentPage === 'about' && (
        <div>
          <About />
          <WhyChooseUs />
        </div>
      )}

      {currentPage === 'plans' && (
        <Membership />
      )}

      {currentPage === 'contact' && (
        <ContactUs />
      )}

      <footer className="bg-black py-10 border-t border-zinc-900 text-center relative z-20">
        <h2 className="text-2xl font-black text-white italic mb-2">NR<span className="text-orange-500">FITNESS</span></h2>
        {currentUser?.fullName && (
          <p className="text-zinc-500 text-sm mb-2">Logged in as {currentUser.fullName}</p>
        )}
        <p className="text-zinc-700 text-xs">© {new Date().getFullYear()} NR Fitness Club. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
