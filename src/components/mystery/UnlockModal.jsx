import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollText, KeyRound } from 'lucide-react';
import WordleGuess from './WordleGuess';

export default function UnlockModal({ letter, open, onOpenChange, onUnlock }) {
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    setUnlocked(true);
    setTimeout(() => {
      onUnlock(letter);
      onOpenChange(false);
      setUnlocked(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border overflow-hidden">
        {unlocked ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-8 gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8 }}
            >
              <ScrollText className="w-16 h-16 text-primary" />
            </motion.div>
            <h3 className="font-heading text-xl text-primary tracking-wider">UNSEALED</h3>
            <p className="text-sm text-muted-foreground italic font-body">The truth reveals itself...</p>
          </motion.div>
        ) : (
          <>
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
              </div>
              <DialogTitle className="font-heading text-lg tracking-wide">
                {letter?.title}
              </DialogTitle>
              {letter?.password_hint && (
                <p className="text-xs text-muted-foreground italic mt-2 font-body">
                  Hint: {letter.password_hint}
                </p>
              )}
            </DialogHeader>

            <div className="py-4">
              {letter?.password && (
                <WordleGuess
                  password={letter.password}
                  onUnlock={handleUnlock}
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}