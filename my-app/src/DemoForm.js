import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './api';
import StatusPopup from './StatusPopup';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const isValidPhone = (phone) => phone.replace(/\D/g, '').length >= 10;

const DemoForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    plan: '',
    message: ''
  });

  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    if (!status.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setStatus({ message: '', type: '' });
    }, 3000);

    return () => clearTimeout(timer);
  }, [status]);

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

    setStatus({ message: 'Processing...', type: 'info' });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/submit-form`, {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        formType: formData.plan
      });

      if (response.status === 201) {
        setStatus({ message: 'Registration completed. Free trial request save ho gayi.', type: 'success' });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          plan: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setStatus({
        message: error.response?.data?.error || 'Invalid details. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <section className="pt-64 pb-20 px-4 bg-transparent relative z-10">
      <StatusPopup status={status} onClose={() => setStatus({ message: '', type: '' })} />

      <div className="max-w-5xl mx-auto bg-black/90 backdrop-blur-md border border-orange-500/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-2 tracking-tight">
              CLAIM YOUR <span className="text-orange-500">FREE DAY</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Not sure yet? Come try out our equipment and meet the trainers for 1 full day.
            </p>

            <ul className="space-y-3 text-gray-500 text-sm font-medium">
              <li className="flex items-center gap-2"><span className="text-orange-500">✓</span> Free Gym Tour</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✓</span> Try Any Machine</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="w-full lg:w-7/12 space-y-5">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-1/2">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Your Sir Name"
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@gmail.com"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 00000 00000"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Interested Service</label>
              <div className="relative">
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 appearance-none"
                >
                  <option value="" disabled>Select a plan</option>
                  <option value="Basic Gym">Basic Gym</option>
                  <option value="Yoga Class">Yoga Class</option>
                  <option value="Aerobics">Aerobics</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Fitness goals..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-orange-500 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.2)]">
              Book A Free Trial
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DemoForm;
