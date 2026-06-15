import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScrollText, Feather, Shield, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import FloatingElements from '@/components/mystery/FloatingElements';
import LetterCard from '@/components/mystery/LetterCard';
import LetterViewer from '@/components/mystery/LetterViewer';
import GoogleIcon from '@/components/GoogleIcon';

const SAAFIA_ART = 'https://media.base44.com/images/public/user_6a035c071ec04324a442b3a2/e91ecdce5_Csaafia.png';
const SAAFIA_EYES = 'https://media.base44.com/images/public/user_6a035c071ec04324a442b3a2/4f81d4bb8_IMG_9782.png';
const SAAFIA_BUTTERFLY = 'https://media.base44.com/images/public/user_6a035c071ec04324a442b3a2/3df6d9099_xCrimson_SM_tr.png';

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  const [unlockIds, setUnlockIds] = useState(() => {
    const saved = localStorage.getItem('saafia_unlocks');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingLetter, setViewingLetter] = useState(null);

  const queryClient = useQueryClient();

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: () => base44.entities.Letter.list('letter_number'),
  });

  const { data: serverUnlocks = [] } = useQuery({
    queryKey: ['unlocks'],
    queryFn: () => base44.entities.LetterUnlock.list(),
    enabled: isAuthenticated,
  });

  // Merge server unlocks with local
  useEffect(() => {
    const serverIds = serverUnlocks.map(u => u.letter_id);
    setUnlockIds(prev => {
      const merged = [...new Set([...prev, ...serverIds])];
      localStorage.setItem('saafia_unlocks', JSON.stringify(merged));
      return merged;
    });
  }, [serverUnlocks]);

  const unlockMutation = useMutation({
    mutationFn: async (letter) => {
      if (!isAuthenticated) return;
      const existing = serverUnlocks.find(u => u.letter_id === letter.id);
      if (!existing) {
        await base44.entities.LetterUnlock.create({
          letter_id: letter.id,
          unlock_code: letter.password,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unlocks'] });
    },
  });

  const handleUnlock = (letter) => {
    const updated = [...new Set([...unlockIds, letter.id])];
    setUnlockIds(updated);
    localStorage.setItem('saafia_unlocks', JSON.stringify(updated));
    if (isAuthenticated) {
      unlockMutation.mutate(letter);
    }
  };

  const handleCardClick = (letter) => {
    setViewingLetter(letter);
  };

  const handleGoogleSignIn = () => {
    base44.auth.loginWithProvider('google', window.location.href);
  };

  const publishedLetters = letters.filter(l => l.is_published);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />

      {/* Auth Bar */}
      <div className="relative z-20 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-end gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {user?.full_name || user?.email || 'Player'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout(true)}
                className="text-xs text-muted-foreground hover:text-foreground h-7"
              >
                <LogOut className="w-3 h-3 mr-1" /> Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoogleSignIn}
              className="text-xs h-8 border-border/50 hover:bg-muted/50"
            >
              <GoogleIcon className="w-4 h-4 mr-1.5" />
              Sign in to save progress
            </Button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative z-10">
        {/* Banner image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img
            src={SAAFIA_EYES}
            alt="Saafia's eyes"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        <div className="relative -mt-20 sm:-mt-24 text-center px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-2 border-primary/30 overflow-hidden shadow-lg shadow-primary/20 mb-4">
              <img src={SAAFIA_BUTTERFLY} alt="Saafia Blarod" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-[0.15em] text-foreground">
              THE LETTERS OF
            </h1>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[0.2em] text-primary mt-1">
              SAAFIA BLAROD
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
              <Feather className="w-4 h-4 text-primary/60" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto italic font-body leading-relaxed">
              Fragments of truth, sealed in ink and shadow. 
              Decipher the passwords to unveil what was hidden.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Letters Grid */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <ScrollText className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-foreground">
            Recovered Letters
          </h3>
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">
            {unlockIds.length} / {publishedLetters.length} unsealed
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : publishedLetters.length === 0 ? (
          <div className="text-center py-20">
            <ScrollText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic font-body">No letters have surfaced yet...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {publishedLetters.map((letter, i) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <LetterCard
                  letter={letter}
                  isUnlocked={unlockIds.includes(letter.id)}
                  onClick={() => handleCardClick(letter)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Saafia art decoration */}
      <div className="hidden lg:block fixed bottom-0 right-0 w-72 opacity-10 pointer-events-none">
        <img src={SAAFIA_ART} alt="" className="w-full" />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-6 text-center">
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.worldanvil.com/w/nethdria-coffeepaladin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-heading uppercase tracking-wider"
          >
            World of Nethdria
          </a>
          <span className="text-muted-foreground/30">·</span>
          <Link
            to="/dm"
            className="text-xs text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          >
            <Shield className="w-3 h-3 inline" />
          </Link>
        </div>
      </footer>

      {/* Letter Viewer */}
      <AnimatePresence>
        {viewingLetter && (
          <LetterViewer
            letter={viewingLetter}
            isUnlocked={unlockIds.includes(viewingLetter.id)}
            onClose={() => setViewingLetter(null)}
            onUnlock={handleUnlock}
          />
        )}
      </AnimatePresence>
    </div>
  );
}