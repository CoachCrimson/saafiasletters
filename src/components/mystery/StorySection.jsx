import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function StorySection({ stories = [], unlockCount = 0, totalLetters = 0 }) {
  const [expandedId, setExpandedId] = useState(null);

  // Sort stories by required_unlock_count
  const sorted = [...stories].sort((a, b) => (a.required_unlock_count || 0) - (b.required_unlock_count || 0));

  if (sorted.length === 0) return null;

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-5 h-5 text-accent" />
        <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-foreground">
          Uncovered Stories
        </h3>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-4">
        {sorted.map((story, i) => {
          const isUnlocked = unlockCount >= (story.required_unlock_count || 0);
          const isExpanded = expandedId === story.id;
          const isReveal = story.is_reveal;
          const progressPercent = totalLetters > 0
            ? Math.min(100, Math.round((unlockCount / (story.required_unlock_count || 1)) * 100))
            : 0;

          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className={`rounded-xl border transition-all duration-300 ${
                  isReveal && isUnlocked
                    ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10'
                    : isUnlocked
                    ? 'border-border bg-card'
                    : 'border-border/50 bg-muted/20 opacity-60'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => isUnlocked && setExpandedId(isExpanded ? null : story.id)}
                  disabled={!isUnlocked}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isReveal && isUnlocked
                      ? 'bg-primary/20 text-primary'
                      : isUnlocked
                      ? 'bg-accent/20 text-accent'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {isReveal ? (
                      <Sparkles className="w-4 h-4" />
                    ) : isUnlocked ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-heading text-sm tracking-wide ${
                      isReveal && isUnlocked ? 'text-primary' : isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {story.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isUnlocked
                        ? 'Discovered — click to read'
                        : `${unlockCount}/${story.required_unlock_count} letters needed`}
                    </p>
                  </div>
                  {/* Progress bar for locked stories */}
                  {!isUnlocked && (
                    <div className="w-16 sm:w-24 h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                      <div
                        className="h-full rounded-full bg-accent/40 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                  {isUnlocked && (
                    <span className="text-xs text-muted-foreground">
                      {isExpanded ? '−' : '+'}
                    </span>
                  )}
                </button>

                {/* Content */}
                <AnimatePresence>
                  {isExpanded && isUnlocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border/50 pt-4">
                        <div className="font-body text-sm text-foreground/90">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                              h1: ({ children }) => <h1 className="text-lg font-heading font-semibold mb-3 mt-6">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-heading font-semibold mb-3 mt-5">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-heading font-semibold mb-2 mt-4">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground mb-4">{children}</blockquote>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              hr: () => <hr className="my-6 border-border/60" />,
                            }}
                          >
                            {story.content || ''}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}