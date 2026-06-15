import { motion } from 'framer-motion';
import { Shield, Feather, Eye, Star, Crown, Key } from 'lucide-react';

const MILESTONES = [
  { count: 1, icon: Key, label: 'First Light', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  { count: 2, icon: Eye, label: 'Watcher', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { count: 3, icon: Feather, label: 'Scribe', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
  { count: 5, icon: Shield, label: 'Guardian', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30' },
  { count: 7, icon: Star, label: 'Truthseeker', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30' },
  { count: 10, icon: Crown, label: 'Heir of Blarod', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40' },
];

export default function ProgressBadges({ unlockCount = 0, totalLetters = 0 }) {
  if (totalLetters === 0) return null;

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-5 h-5 text-amber-400" />
        <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-foreground">
          Milestones
        </h3>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-body">
          {unlockCount} of {totalLetters}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {MILESTONES.map((milestone, i) => {
          const earned = unlockCount >= milestone.count;
          const Icon = milestone.icon;

          return (
            <motion.div
              key={milestone.count}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={earned ? {
                  boxShadow: [
                    `0 0 0 0 rgba(250,204,21,0)`,
                    `0 0 12px 2px rgba(250,204,21,0.3)`,
                    `0 0 0 0 rgba(250,204,21,0)`,
                  ],
                } : {}}
                transition={earned ? { duration: 2.5, repeat: Infinity } : {}}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  earned
                    ? `${milestone.bg} ${milestone.border}`
                    : 'bg-muted/30 border-border/30'
                }`}
              >
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-500 ${
                  earned ? milestone.color : 'text-muted-foreground/30'
                }`} />
              </motion.div>

              <span className={`text-[10px] sm:text-xs font-heading uppercase tracking-widest transition-all duration-500 ${
                earned ? milestone.color : 'text-muted-foreground/40'
              }`}>
                {milestone.label}
              </span>

              {earned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}