import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, ScrollText } from 'lucide-react';

export default function LetterCard({ letter, isUnlocked, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 ${
        isUnlocked
          ? 'border-primary/40 bg-card shadow-lg shadow-primary/10'
          : 'border-border bg-card/60 hover:border-accent/40'
      }`}>
        {/* Thumbnail */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {letter.censored_pages?.[0] ? (
            <img
              src={letter.censored_pages[0]}
              alt={letter.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isUnlocked ? '' : 'blur-xl brightness-50 scale-110'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ScrollText className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay for locked */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Lock className="w-10 h-10 text-muted-foreground/60 mb-2" />
              </motion.div>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Sealed</p>
            </div>
          )}

          {/* Unlocked badge */}
          {isUnlocked && (
            <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground rounded-full p-1.5">
              <Unlock className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
            {letter.title}
          </h3>
          {letter.date_in_world && (
            <p className="text-xs text-muted-foreground mt-1 italic font-body">
              {letter.date_in_world}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2">
            {isUnlocked ? (
              <span className="text-xs text-primary flex items-center gap-1">
                <Eye className="w-3 h-3" /> Read
              </span>
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
            {letter.censored_pages && (
              <span className="text-xs text-muted-foreground ml-auto">
                {letter.censored_pages.length} {letter.censored_pages.length === 1 ? 'page' : 'pages'}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}