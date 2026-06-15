import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function CharacterInfo({ characters = [] }) {
  const [activeId, setActiveId] = useState(null);

  const sorted = [...characters].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (sorted.length === 0) return null;

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-foreground">
          The Blarod Family
        </h3>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sorted.map((char, i) => {
          const isActive = activeId === char.id;

          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div
                className={`rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/30 ${
                  isActive ? 'ring-1 ring-primary/30 shadow-lg shadow-primary/5' : ''
                }`}
                onClick={() => setActiveId(isActive ? null : char.id)}
              >
                {/* Portrait */}
                {char.image_url && (
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={char.image_url}
                      alt={char.name}
                      className="w-full h-full object-contain bg-muted/50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                )}

                {/* Info */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading text-base tracking-wide text-foreground">
                        {char.name}
                      </h4>
                      {char.role_label && (
                        <p className="text-xs text-primary font-heading uppercase tracking-wider mt-0.5">
                          {char.role_label}
                        </p>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </div>

                  {isActive && char.description && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border/50 prose prose-sm prose-invert max-w-none font-body">
                        <ReactMarkdown>{char.description}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}