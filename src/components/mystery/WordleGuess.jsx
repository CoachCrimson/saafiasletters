import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

function getLetterStates(guess, answer) {
  const g = guess.toLowerCase().split('');
  const a = answer.toLowerCase().split('');
  const result = g.map(() => 'absent');
  const answerUsed = a.map(() => false);

  // First pass: correct positions
  g.forEach((letter, i) => {
    if (letter === a[i]) {
      result[i] = 'correct';
      answerUsed[i] = true;
    }
  });

  // Second pass: present but wrong position
  g.forEach((letter, i) => {
    if (result[i] === 'correct') return;
    const idx = a.findIndex((al, ai) => al === letter && !answerUsed[ai]);
    if (idx !== -1) {
      result[i] = 'present';
      answerUsed[idx] = true;
    }
  });

  return result;
}

const CELL_COLORS = {
  correct: 'bg-emerald-600 border-emerald-500 text-white',
  present: 'bg-amber-600 border-amber-500 text-white',
  absent: 'bg-zinc-700 border-zinc-600 text-zinc-300',
  empty: 'border-border bg-muted/30',
  active: 'border-primary bg-muted/50',
};

export default function WordleGuess({ password, onUnlock, maxAttempts = 6 }) {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [shakeRow, setShakeRow] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const passwordLen = password.length;

  // Dynamically size cells based on password length
  const cellSize = passwordLen <= 6
    ? 'w-11 h-11 sm:w-14 sm:h-14'
    : passwordLen <= 8
    ? 'w-10 h-10 sm:w-12 sm:h-12'
    : passwordLen <= 10
    ? 'w-8 h-8 sm:w-10 sm:h-10'
    : 'w-7 h-7 sm:w-9 sm:h-9';
  const cellText = passwordLen <= 6
    ? 'text-base sm:text-lg'
    : passwordLen <= 8
    ? 'text-sm sm:text-base'
    : 'text-xs sm:text-sm';
  const cellGap = passwordLen <= 6 ? 'gap-2' : passwordLen <= 8 ? 'gap-1.5' : 'gap-1';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (currentGuess.length !== passwordLen) {
      setShakeRow(true);
      setMessage(`Password is ${passwordLen} characters`);
      setTimeout(() => { setShakeRow(false); setMessage(''); }, 1000);
      return;
    }

    const states = getLetterStates(currentGuess, password);
    const newGuess = { word: currentGuess, states };
    const updated = [...guesses, newGuess];
    setGuesses(updated);
    setCurrentGuess('');

    if (currentGuess.toLowerCase() === password.toLowerCase()) {
      setTimeout(() => onUnlock(), 800);
    } else if (updated.length >= maxAttempts) {
      setMessage('No more attempts. The secret remains hidden...');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z0-9]$/.test(e.key) && currentGuess.length < passwordLen) {
      setCurrentGuess(prev => prev + e.key);
    }
  };

  const isComplete = guesses.some(g => g.word.toLowerCase() === password.toLowerCase());
  const isExhausted = guesses.length >= maxAttempts && !isComplete;

  return (
    <div
      className="flex flex-col items-center gap-4 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={inputRef}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm text-muted-foreground font-body">
          Decipher the password ({passwordLen} characters)
        </p>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      {/* Past guesses */}
      <div className="flex flex-col gap-2">
        {guesses.map((guess, gi) => (
          <motion.div
            key={gi}
            className={`flex ${cellGap}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {guess.word.split('').map((letter, li) => (
              <motion.div
                key={li}
                className={`${cellSize} ${cellText} flex items-center justify-center rounded-md border-2 font-heading font-bold uppercase ${CELL_COLORS[guess.states[li]]}`}
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: li * 0.1, duration: 0.3 }}
              >
                {letter}
              </motion.div>
            ))}
          </motion.div>
        ))}

        {/* Current guess row */}
        {!isComplete && !isExhausted && (
          <motion.div
            className={`flex ${cellGap} ${shakeRow ? 'animate-shake' : ''}`}
            animate={shakeRow ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {Array.from({ length: passwordLen }).map((_, i) => (
              <div
                key={i}
                className={`${cellSize} ${cellText} flex items-center justify-center rounded-md border-2 font-heading font-bold uppercase transition-all ${
                  i < currentGuess.length ? CELL_COLORS.active : CELL_COLORS.empty
                }`}
              >
                {currentGuess[i] || ''}
              </div>
            ))}
          </motion.div>
        )}

        {/* Empty remaining rows */}
        {Array.from({ length: Math.max(0, maxAttempts - guesses.length - (isComplete || isExhausted ? 0 : 1)) }).map((_, ri) => (
          <div key={ri} className={`flex ${cellGap}`}>
            {Array.from({ length: passwordLen }).map((_, ci) => (
              <div
                key={ci}
                className={`${cellSize} flex items-center justify-center rounded-md border-2 ${CELL_COLORS.empty} opacity-30`}
              />
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-destructive font-body italic"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {!isComplete && !isExhausted && (
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleSubmit}
            className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 font-heading text-xs uppercase tracking-wider"
          >
            Submit Guess
          </Button>
        </div>
      )}

      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" /> Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-amber-600 inline-block" /> Wrong spot
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-zinc-700 inline-block" /> Not in word
        </span>
      </div>
    </div>
  );
}