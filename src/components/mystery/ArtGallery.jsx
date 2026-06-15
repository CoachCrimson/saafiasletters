import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ZoomIn } from 'lucide-react';

export default function ArtGallery({ art = [] }) {
  const [lightbox, setLightbox] = useState(null);

  const saafiaArt = art.filter(a => !a.character_name || a.character_name.toLowerCase().includes('saafia'));
  const rubisArt = art.filter(a => a.character_name && a.character_name.toLowerCase().includes('rubis'));

  if (art.length === 0) return null;

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Image className="w-5 h-5 text-accent" />
        <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-foreground">
          Artistic Renderings
        </h3>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Saafia */}
      {saafiaArt.length > 0 && (
        <div className="mb-8">
          <h4 className="font-heading text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Saafia Blarod
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saafiaArt.map((item, i) => (
              <ArtCard key={item.id} item={item} index={i} onClick={() => setLightbox(item)} />
            ))}
          </div>
        </div>
      )}

      {/* Rubis */}
      {rubisArt.length > 0 && (
        <div>
          <h4 className="font-heading text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4">
            Rubis Blarod
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rubisArt.map((item, i) => (
              <ArtCard key={item.id} item={item} index={i} onClick={() => setLightbox(item)} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <img
              src={lightbox.image_url}
              alt={lightbox.title}
              className="max-w-full max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white/80 text-sm mt-4 font-heading tracking-wider">{lightbox.title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ArtCard({ item, index, onClick }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 aspect-[3/4]">
        <img
          src={item.image_url}
          alt={item.title}
          className={`w-full h-full object-contain transition-all duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      {item.title && (
        <p className="text-xs text-muted-foreground mt-2 text-center font-body italic">{item.title}</p>
      )}
    </motion.div>
  );
}