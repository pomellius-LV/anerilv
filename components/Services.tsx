
import React from 'react';
import { Content, View } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ServicesProps {
  content: Content;
  setView?: (view: View) => void;
}

const Services: React.FC<ServicesProps> = ({ content, setView }) => {
  const { services } = content;

  // Function to handle navigation to the specific price section
  const handleServiceClick = (id: string) => {
    if (setView) {
      setView('prices');
      // Small delay to allow the view to change before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <section id="services" className="py-16 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-800 mb-4">{services.title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {services.items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleServiceClick(item.id)}
              className="group text-left bg-white p-6 rounded-[1.5rem] border border-stone-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-stone-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Sparkles size={18} strokeWidth={1.5} />
                </div>
                <div className="text-stone-300 group-hover:text-primary transition-colors duration-300">
                  <ArrowRight size={20} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-stone-500 leading-relaxed font-light text-sm">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
