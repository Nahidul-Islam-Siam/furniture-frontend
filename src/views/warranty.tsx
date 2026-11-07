import { ShieldCheck, Truck, RefreshCw, PhoneCall } from 'lucide-react';

export default function Warranty() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Customer Service
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-neutral-900">
          Return & Warranty Policy
        </h1>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          At GRID, we stand firmly behind every piece of commercial and ergonomic furniture we deliver across Bangladesh.
        </p>
      </div>

      <div className="space-y-10 text-neutral-700 leading-relaxed text-sm sm:text-base">
        
        {/* Warranty Section */}
        <div className="bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-100 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-neutral-900" />
            <h2 className="font-heading font-bold text-xl text-neutral-900">
              Up to 5 Years Warranty Coverage
            </h2>
          </div>
          <p>
            GRID offers 3 to 5 years warranty on all motorized elevating desk mechanisms, carbon steel frames, and ergonomic task chair mechanisms.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
            <li>Motorized Standing Desks: 5 years frame warranty and 3 years motor/control box warranty.</li>
            <li>Steelcase & Premium Ergonomic Chairs: Up to 5 years servicing and mechanical warranty.</li>
            <li>Standard Workstation Chairs: 3 years servicing warranty.</li>
          </ul>
        </div>

        {/* Free Pick-up & Servicing */}
        <div className="bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-100 space-y-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-neutral-900" />
            <h2 className="font-heading font-bold text-xl text-neutral-900">
              Hassle-Free Doorstep Servicing
            </h2>
          </div>
          <p>
            GRID provides an easy, hassle-free servicing system where we pick up your product directly from your home or office inside Dhaka if there is any defect or problem, repair it with original parts, and deliver it back to you.
          </p>
        </div>

        {/* Delivery Terms */}
        <div className="bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-100 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-neutral-900" />
            <h2 className="font-heading font-bold text-xl text-neutral-900">
              Free Home Delivery & Assembly
            </h2>
          </div>
          <p>
            Inside Dhaka city, all orders over ৳10,000 enjoy 100% FREE doorstep delivery including professional technician assembly within 3 working days.
            Delivery to any district across Bangladesh takes 5–7 working days via courier.
          </p>
        </div>

        {/* Support contact */}
        <div className="p-6 rounded-2xl border border-neutral-200 text-center space-y-3">
          <h3 className="font-heading font-bold text-lg text-neutral-900">
            Need Warranty Support or Have Questions?
          </h3>
          <p className="text-neutral-600 text-sm">
            Contact our dedicated support hotline or send us a message with your Order ID.
          </p>
          <div className="flex items-center justify-center gap-2 font-semibold text-neutral-900">
            <PhoneCall className="w-4 h-4" />
            <span>Hotline: +880 1700-009947</span>
          </div>
        </div>

      </div>
    </div>
  );
}
