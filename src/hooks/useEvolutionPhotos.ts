import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PhotoGroup {
  date: string;
  label: string;
  photos: string[];
  type: 'inicial' | 'evolucao';
}

export function useEvolutionPhotos() {
  const { user } = useAuth();
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchPhotos();
  }, [user]);

  const fetchPhotos = async () => {
    if (!user) return;

    setLoading(true);
    const groups: PhotoGroup[] = [];

    try {
      // Fetch initial photos from anamnese
      const { data: anamneseData } = await supabase
        .from('anamnese')
        .select('fotos_iniciais, created_at')
        .eq('user_id', user.id)
        .single();

      if (anamneseData?.fotos_iniciais && anamneseData.fotos_iniciais.length > 0) {
        groups.push({
          date: anamneseData.created_at || new Date().toISOString(),
          label: 'Fotos Iniciais',
          photos: anamneseData.fotos_iniciais,
          type: 'inicial',
        });
      }

      // Fetch evolution photos from weekly checkins
      const { data: checkinData } = await supabase
        .from('checkin_semanal')
        .select('fotos_evolucao, semana_inicio, created_at')
        .eq('user_id', user.id)
        .order('semana_inicio', { ascending: false });

      if (checkinData) {
        checkinData.forEach((checkin) => {
          if (checkin.fotos_evolucao && checkin.fotos_evolucao.length > 0) {
            const date = new Date(checkin.semana_inicio);
            const label = `Semana ${date.toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'short' 
            })}`;
            
            groups.push({
              date: checkin.semana_inicio,
              label,
              photos: checkin.fotos_evolucao,
              type: 'evolucao',
            });
          }
        });
      }

      // Sort by date descending (most recent first), but keep initial photos at the end
      groups.sort((a, b) => {
        if (a.type === 'inicial') return 1;
        if (b.type === 'inicial') return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setPhotoGroups(groups);
    } catch (error) {
      console.error('Error fetching evolution photos:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    photoGroups,
    loading,
    refetch: fetchPhotos,
    totalPhotos: photoGroups.reduce((acc, group) => acc + group.photos.length, 0),
  };
}
