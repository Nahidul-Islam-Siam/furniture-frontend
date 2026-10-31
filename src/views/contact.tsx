import { useState } from 'react';
import { FooterPromotions } from '../components/grid/FooterPromotions';
import { toast } from 'sonner';
import { CheckCircle2, MapPin } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Thanks for contacting us. We’ll get back to you as soon as possible.');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="w-full bg-white font-sans text-neutral-900">
      
      {/* 1. Rich Text Section: Get in touch */}
      <section className="pt-16 pb-12 border-b border-neutral-100">
        <div className="max-w-[750px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight mb-5">
            Get in touch
          </h2>
          <div className="text-base sm:text-lg text-neutral-700 leading-relaxed space-y-3 font-normal">
            <p>
              Email us:
              <a
                href="mailto:gridfurnitures@gmail.com"
                className="underline hover:text-black transition-colors"
              >
                gridfurnitures@gmail.com
              </a>
            </p>
            <p>
              Call us:
              <a
                href="tel:01404431330"
                className="underline hover:text-black transition-colors"
              >
                014044 31330-5
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Rich Text Section: Display Center */}
      <section className="py-14 border-b border-neutral-100">
        <div className="max-w-[750px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight mb-5">
            Display Center
          </h2>
          <div className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
            <p className="mb-2">
              House 111, Road 8, Block C, Banani (Behind Hotel Sarina)
            </p>
            <p>
              Google Map Location link:&nbsp;
              <a
                href="https://goo.gl/maps/XZmY1nKkqqtgKnrw5"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-black transition-colors inline-flex items-center gap-1"
                title="Map View"
              >
                <span>Click Here</span>
                <MapPin className="w-4 h-4 text-neutral-500" />
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Form Section: Contact us */}
      <section className="py-16">
        <div className="max-w-[750px] mx-auto px-4 sm:px-6">
          
          <div className="mb-8">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 tracking-tight text-center">
              Contact us
            </h2>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-neutral-900">
                Message Sent
              </h3>
              <p className="text-neutral-600 text-sm max-w-md mx-auto">
                Thanks for contacting us. We’ll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-2 px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name & Email 2-column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="ContactFormName"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="ContactFormName"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ContactFormEmail"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="ContactFormEmail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="ContactFormMessage"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="ContactFormMessage"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-y"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3.5 bg-black text-white text-xs font-bold  tracking-widest  transition-all active:scale-[0.99] disabled:opacity-75 shadow-sm"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>

              {/* Privacy and Security Disclaimer */}
              <p className="text-[11px] text-neutral-400 leading-relaxed pt-2">
                This site is protected by hCaptcha and the hCaptcha{' '}
                <a
                  href="https://hcaptcha.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-neutral-600"
                >
                  Privacy Policy
                </a>
                and
                <a
                  href="https://hcaptcha.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-neutral-600"
                >
                  Terms of Service
                </a>
                apply.
              </p>
            </form>
          )}
        </div>
      </section>
      {/* 4. Footer Promotions (3 Cards identical to 99grid.com contact page) */}
      <FooterPromotions />
    </div>
  );
}