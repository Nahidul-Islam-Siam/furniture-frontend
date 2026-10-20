import { COMPANY_LOGOS } from '../../data/gridData';

export const CompanyLogosSection: React.FC = () => {
  return (
    <section className="py-20 bg-neutral-50/70 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 mb-10 tracking-tight">
          Trusted By Top Companies
        </h2>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-center justify-items-center">
          {COMPANY_LOGOS.map((company, idx) => (
            <div
              key={idx}
              className="w-full max-w-[160px] h-20 px-4 py-3 bg-white rounded-xl shadow-xs border border-neutral-100 flex items-center justify-center grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={company.url}
                alt={company.name}
                className="max-h-12 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
