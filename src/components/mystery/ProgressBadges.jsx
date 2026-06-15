import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, Key, Eye, Feather, Shield, Crown, ScrollText, Sparkles, Heart, Flame, Moon, Sun, Gem, Sword, BookOpen, Trophy } from 'lucide-react';

const ICON_MAP = {
  Key, Eye, Feather, Shield, Star, Crown, ScrollText, Sparkles,
  Heart, Flame, Moon, Sun, Gem, Sword, BookOpen, Trophy,
};

export default function ProgressBadges({ unlockCount = 0, totalLetters = 0 }) {
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['milestones'],
    queryFn: () => base44.entities.Milestone.list('order'),
  });

  if (totalLetters === 0) return null;
  if (isLoading) return null;
  if (milestones.length === 0) return null;

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
        {milestones.map((milestone, i) => {
          const earned = unlockCount >= milestone.count;
          const IconComponent = ICON_MAP[milestone.icon_name] || Star;

          return (
            <motion.div
              key={milestone.id}
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
                <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-500 ${
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