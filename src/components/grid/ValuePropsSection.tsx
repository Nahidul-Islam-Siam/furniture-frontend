import { Truck, RefreshCw, CreditCard } from 'lucide-react';
import { VALUE_PROPOSITIONS } from '../../data/gridData';

export const ValuePropsSection: React.FC = () => {
  const icons = [
    <Truck className="w-8 h-8 text-neutral-900" />,
    <RefreshCw className="w-8 h-8 text-neutral-900" />,
    <CreditCard className="w-8 h-8 text-neutral-900" />,
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <div
              key={prop.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-neutral-50/70 border border-neutral-100 transition-all hover:shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5 border border-neutral-100">
                {icons[idx]}
              </div>

              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3">
                {prop.title}
              </h3>

              <p className="font-sans text-sm text-neutral-600 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
