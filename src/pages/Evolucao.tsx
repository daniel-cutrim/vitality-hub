import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEvolutionPhotos, PhotoGroup } from '@/hooks/useEvolutionPhotos';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Camera, 
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Evolucao() {
  const navigate = useNavigate();
  const { photoGroups, loading, totalPhotos } = useEvolutionPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; groupIndex: number; photoIndex: number } | null>(null);

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    
    const { groupIndex, photoIndex } = selectedPhoto;
    const currentGroup = photoGroups[groupIndex];
    
    if (photoIndex > 0) {
      setSelectedPhoto({
        url: currentGroup.photos[photoIndex - 1],
        groupIndex,
        photoIndex: photoIndex - 1,
      });
    } else if (groupIndex > 0) {
      const prevGroup = photoGroups[groupIndex - 1];
      setSelectedPhoto({
        url: prevGroup.photos[prevGroup.photos.length - 1],
        groupIndex: groupIndex - 1,
        photoIndex: prevGroup.photos.length - 1,
      });
    }
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    
    const { groupIndex, photoIndex } = selectedPhoto;
    const currentGroup = photoGroups[groupIndex];
    
    if (photoIndex < currentGroup.photos.length - 1) {
      setSelectedPhoto({
        url: currentGroup.photos[photoIndex + 1],
        groupIndex,
        photoIndex: photoIndex + 1,
      });
    } else if (groupIndex < photoGroups.length - 1) {
      const nextGroup = photoGroups[groupIndex + 1];
      setSelectedPhoto({
        url: nextGroup.photos[0],
        groupIndex: groupIndex + 1,
        photoIndex: 0,
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={() => navigate('/perfil')}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Minha Evolução</h1>
          <p className="text-sm text-muted-foreground">
            {totalPhotos} {totalPhotos === 1 ? 'foto' : 'fotos'} de progresso
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-primary" />
        </div>
      </motion.div>

      {/* Empty State */}
      {photoGroups.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma foto ainda
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            Comece a registrar sua evolução! Adicione fotos no checkin semanal ou na anamnese.
          </p>
          <Button onClick={() => navigate('/anamnese')}>
            <Camera className="w-4 h-4 mr-2" />
            Começar Anamnese
          </Button>
        </motion.div>
      )}

      {/* Photo Groups */}
      <div className="space-y-6">
        {photoGroups.map((group, groupIndex) => (
          <motion.div
            key={`${group.type}-${group.date}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            {/* Group Header */}
            <div className="flex items-center gap-2 mb-3">
              {group.type === 'inicial' ? (
                <Sparkles className="w-4 h-4 text-primary" />
              ) : (
                <Calendar className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={`text-sm font-medium ${
                group.type === 'inicial' ? 'text-primary' : 'text-foreground'
              }`}>
                {group.label}
              </span>
              <span className="text-xs text-muted-foreground">
                • {new Date(group.date).toLocaleDateString('pt-BR')}
              </span>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-2">
              {group.photos.map((photo, photoIndex) => (
                <motion.button
                  key={`${group.date}-${photoIndex}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPhoto({ url: photo, groupIndex, photoIndex })}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                    group.type === 'inicial' 
                      ? 'border-primary/30' 
                      : 'border-border'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Evolução ${photoIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {group.type === 'inicial' && photoIndex === 0 && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      Início
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white disabled:opacity-30"
              disabled={selectedPhoto.groupIndex === 0 && selectedPhoto.photoIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white disabled:opacity-30"
              disabled={
                selectedPhoto.groupIndex === photoGroups.length - 1 && 
                selectedPhoto.photoIndex === photoGroups[selectedPhoto.groupIndex].photos.length - 1
              }
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto.url}
              alt="Foto de evolução"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Photo Info */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
              {photoGroups[selectedPhoto.groupIndex].label} • Foto {selectedPhoto.photoIndex + 1} de {photoGroups[selectedPhoto.groupIndex].photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
