import { Truck, ShieldCheck, Recycle, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { CSSProperties } from 'react';

const features = [
  { icon: Truck, title: 'Free Shipping Over Rs. 3,000', desc: 'On all orders across Nepal', color: 'bg-primary-100 text-primary' },
  { icon: ShieldCheck, title: '0 Additives · 0 Preservatives', desc: '100% Pure Himalayan Wholesomeness', color: 'bg-emerald-100 text-emerald-600' },
  { icon: Recycle, title: 'Earth-Friendly Packaging', desc: 'Recyclable glass & biodegradable', color: 'bg-lime-100 text-lime-600' },
  { icon: Sparkles, title: 'Farm Fresh Daily', desc: 'Direct sourcing, no middlemen', color: 'bg-gold/20 text-gold-700' },
];

const confettiColors = ['#3a6b35', '#7aa95c', '#d9a441', '#e74c3c', '#3498db', '#9b59b6', '#f39c12', '#1abc9c'];
const confettiParticles = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const distOffset = ((i * 37) % 50);
  const rotOffset = ((i * 53) % 360) - 180;
  const distance = 50 + distOffset;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 20,
    rot: rotOffset,
    color: confettiColors[i % confettiColors.length],
    delay: (i % 4) * 0.05,
  };
});

export default function FeaturesStrip() {
  return (
    <ScrollReveal direction="up" distance={25}>
      <section className="bg-white border-y border-ink/5 overflow-hidden w-full max-w-full mt-10">
        <div className="container-nm py-5 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex items-center gap-4 group relative ${
                  i === 0 ? 'truck-animation-card' : ''
                } ${
                  i === 0 ? 'truck-impact-shake' : ''
                }`}
              >
                {/* Truck drive-in animation for the first feature card */}
                {i === 0 && (
                  <>
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 truck-hit-card z-10">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary-100 text-primary">
                        <Truck className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Confetti celebration burst */}
                    <div className="confetti-container">
                      {confettiParticles.map((p, idx) => (
                        <span
                          key={idx}
                          className="confetti-particle"
                          style={{
                            backgroundColor: p.color,
                            animationDelay: `${p.delay}s`,
                            '--confetti-x': `${p.x}px`,
                            '--confetti-y': `${p.y}px`,
                            '--confetti-rot': `${p.rot}deg`,
                          } as CSSProperties}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-heading font-semibold text-sm text-ink">{feature.title}</div>
                  <div className="text-xs text-ink/50 mt-0.5">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
