import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Corporate Order / Bulk Pricing',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Our representative will call you shortly.');
  };

  return (
    <div className="w-full bg-white font-sans py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Get In Touch
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-neutral-900 tracking-tight">
            Contact GRID Furniture
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto font-light">
            Have questions about dimensions, bulk corporate orders, or warranty? We’re here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-2xl text-neutral-900">
                Studio & Headquarters
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Visit our experience studio to test out ergonomic chairs and motorized standing desk setups in person.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="p-3 bg-white rounded-lg shadow-xs text-neutral-900">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Dhaka Experience Studio</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Plot 12, Road 4, Gulshan-1, Dhaka 1212, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="p-3 bg-white rounded-lg shadow-xs text-neutral-900">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Hotline & Customer Service</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    +880 1700-009947 (10:00 AM – 8:00 PM, Every day)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="p-3 bg-white rounded-lg shadow-xs text-neutral-900">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Email Inquiries</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    support@99grid.com | sales@99grid.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="p-3 bg-white rounded-lg shadow-xs text-neutral-900">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900">Delivery Timings</h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Inside Dhaka: 3 working days with assembly. Outside Dhaka: 5-7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="bg-neutral-50 p-8 sm:p-10 rounded-3xl border border-neutral-100">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-neutral-900">Message Received!</h3>
                <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                  Thank you for reaching out. A GRID product specialist will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-bold text-xl text-neutral-900 mb-2">
                  Send Us A Message
                </h3>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full text-sm p-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tanvir@example.com"
                      className="w-full text-sm p-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full text-sm p-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-sm p-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-neutral-800"
                  >
                    <option>Corporate Order / Bulk Pricing</option>
                    <option>Product Inquiries (Desk / Chair Specs)</option>
                    <option>Warranty & Servicing Request</option>
                    <option>Custom Dimension Table Top</option>
                    <option>Other Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your requirements or setup..."
                    className="w-full text-sm p-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-medium text-sm rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}