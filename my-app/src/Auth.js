import React, { useState } from 'react';
import axios from 'axios';
import Antigravity from './Antigravity';
import API_BASE_URL from './api';

const initialFormData = {
  fullName: '',
  email: '',
  password: ''
};

const Auth = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAuthMode = () => {
    setIsSignUp((current) => !current);
    setFormData(initialFormData);
    setStatus({ message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: isSignUp ? 'Creating account...' : 'Logging in...', type: 'info' });

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUp
        ? formData
        : {
            email: formData.email,
            password: formData.password
          };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      setStatus({
        message: response.data.message || (isSignUp ? 'Account created successfully!' : 'Login successful!'),
        type: 'success'
      });

      setFormData(initialFormData);
      onLogin(response.data.user);
    } catch (error) {
      console.error('Auth Error:', error);
      setStatus({
        message: error.response?.data?.error || 'Request failed. Backend ya MongoDB check karo.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <Antigravity count={200} color="#1d4ed8" particleSize={2} />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-zinc-950/80 backdrop-blur-xl rounded-[2rem] border border-zinc-800 shadow-2xl mx-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white italic tracking-tight">
            NR<span className="text-orange-500">FIT</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm uppercase tracking-[0.2em] font-semibold">
            {isSignUp ? 'Join The Club' : 'Welcome Back'}
          </p>
        </div>

        {status.message && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
              status.type === 'success'
                ? 'border-green-500/40 bg-green-500/10 text-green-300'
                : status.type === 'error'
                  ? 'border-red-500/40 bg-red-500/10 text-red-300'
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full bg-black border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-xl uppercase tracking-wider transition-all transform active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.4)] mt-4"
          >
            {isSubmitting ? 'Please Wait...' : isSignUp ? 'Create Account' : 'Enter Gym'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm font-medium">
            {isSignUp ? 'Already a member? ' : "Don't have an account? "}
            <button
              onClick={toggleAuthMode}
              className="text-blue-500 hover:text-white transition-colors underline font-bold"
            >
              {isSignUp ? 'Login Here' : 'Sign Up Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
