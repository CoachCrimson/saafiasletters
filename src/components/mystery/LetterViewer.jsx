import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, Download, BookOpen, KeyRound } from 'lucide-react';
import WordleGuess from './WordleGuess';

export default function LetterViewer({ letter, isUnlocked, onClose, onUnlock }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showUncensored, setShowUncensored] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const effectiveUncensored = isUnlocked && showUncensored;

  const pages = effectiveUncensored
    ? letter.uncensored_pages || letter.censored_pages || []
    : letter.censored_pages || [];

  const handleUnlock = () => {
    setShowUnlock(false);
    onUnlock(letter);
  };

  const totalPages = pages.length;

  const handleDownload = async () => {
    const url = pages[currentPage];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${letter.title}_page_${currentPage + 1}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border/50">
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground">{letter.title}</h2>
          {letter.date_in_world && (
            <p className="text-xs text-muted-foreground italic">{letter.date_in_world}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isUnlocked && letter.uncensored_pages?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUncensored(!showUncensored)}
              className={`text-xs font-heading uppercase tracking-wider ${
                showUncensored ? 'bg-primary/20 border-primary/40 text-primary' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              {showUncensored ? 'Uncensored' : 'Censored'}
            </Button>
          )}
          {!isUnlocked && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnlock(true)}
              className="text-xs font-heading uppercase tracking-wider border-amber-600/40 text-amber-400 hover:bg-amber-600/10"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1" />
              Decipher
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Page viewer */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-4">
        {totalPages > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="absolute left-2 z-10 bg-background/80 backdrop-blur"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${showUncensored}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-full flex items-center justify-center"
          >
            {pages[currentPage] ? (
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className={`max-h-[calc(100vh-180px)] max-w-full object-contain rounded-lg shadow-2xl cursor-zoom-in ${
                  effectiveUncensored && !isUnlocked ? 'blur-lg brightness-[0.35] sepia-[0.3] pointer-events-none select-none' : 'shadow-primary/5'
                }`}
                onClick={() => (isUnlocked || !effectiveUncensored) && setZoomOpen(true)}
              />
            ) : (
              <div className="w-64 h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No image</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="absolute right-2 z-10 bg-background/80 backdrop-blur"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Unlock overlay */}
      <AnimatePresence>
        {showUnlock && !isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full mx-4 shadow-2xl shadow-primary/10"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-600/10 border border-amber-600/20 flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-heading text-lg tracking-wide text-foreground">Decipher {letter.title}</h3>
                {letter.password_hint && (
                  <p className="text-xs text-muted-foreground italic mt-2 font-body">
                    Hint: {letter.password_hint}
                  </p>
                )}
              </div>
              <WordleGuess
                password={letter.password}
                onUnlock={handleUnlock}
              />
              <div className="flex justify-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUnlock(false)}
                  className="text-xs text-muted-foreground"
                >
                  Continue reading censored version
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-border/50">
        {totalPages > 1 && (
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
        <span className="text-xs text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setZoomOpen(true)}>
            <ZoomIn className="w-4 h-4 mr-1" /> Enlarge
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      {/* Zoom dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-background/95 border-border overflow-auto">
          {pages[currentPage] && (
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1} zoomed`}
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}