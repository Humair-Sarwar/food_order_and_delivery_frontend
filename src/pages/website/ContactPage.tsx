import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Header Banner */}
      <section className="bg-gray-950 text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        <div className="max-w-[96rem] mx-auto text-center space-y-4 relative z-10">
          <h2 className="text-xs sm:text-sm font-bold text-orange-500 uppercase tracking-[0.3em]">Get In Touch</h2>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight">
            We'd Love To Hear <br className="hidden sm:inline" />
            <span className="text-orange-500">From You</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have a question about your order, feedback, or partnership inquiries? Reach out to our team and we'll respond promptly.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* 2. Main Contact Section (Info Cards + Form) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[96rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Side: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h2 className="text-xs sm:text-sm font-bold text-orange-600 uppercase tracking-[0.2em]">Communication Channels</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                Let's Start A Conversation
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Whether you have queries regarding our delivery zones, payment gateways like Square, or general support, we are here for you 24/7.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {/* Phone Card */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-all">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</h4>
                  <p className="text-gray-950 font-bold text-base sm:text-lg">+92 300 0000000</p>
                  <p className="text-gray-500 text-xs mt-0.5">Mon - Sun: Always Open</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-all">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</h4>
                  <p className="text-gray-950 font-bold text-base sm:text-lg">hello@foodie.pk</p>
                  <p className="text-gray-500 text-xs mt-0.5">Online support anytime</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-all">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Office Location</h4>
                  <p className="text-gray-950 font-bold text-base sm:text-lg">Islamabad, Pakistan</p>
                  <p className="text-gray-500 text-xs mt-0.5">Expanding across 150+ cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-gray-50 p-6 sm:p-10 rounded-[2.5rem] border border-gray-200/80 shadow-sm relative">
              {isSubmitted ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-950">Message Sent Successfully!</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Thank you for reaching out. Our support representative will review your message and contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-950">Send Us A Message</h3>
                    <p className="text-gray-500 text-sm">Fill out the form below and we'll get back to you within a few hours.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+92 300 1234567" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Subject *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Order Inquiry / Support" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your Message *</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Write your message here..." 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-900 resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};