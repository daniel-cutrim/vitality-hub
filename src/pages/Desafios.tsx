import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';
import { GamificationHeader } from '@/components/gamification/GamificationHeader';
import { ProgressCard } from '@/components/gamification/ProgressCard';
import { RankingsCard } from '@/components/gamification/RankingsCard';
import { ActiveChallengesCard } from '@/components/gamification/ActiveChallengesCard';
import { BadgesGalleryModal } from '@/components/gamification/BadgesGalleryModal';
import { CreateChallengeModal } from '@/components/gamification/CreateChallengeModal';
import { ChallengeDetailModal } from '@/components/gamification/ChallengeDetailModal';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { FriendsModal } from '@/components/gamification/FriendsModal';
import { Desafio } from '@/hooks/useGamification';

export default function Desafios() {
  const {
    loading,
    pontuacao,
    nivelAtual,
    progressoNivel,
    pontosProximoNivel,
    badges,
    userBadges,
    desafiosAtivos,
    historico,
    amigos,
    showLevelUp,
    newLevel,
    setShowLevelUp,
    createDesafio,
    generateRankings,
    getStreakMultiplier,
    NIVEIS_INFO,
  } = useGamification();

  const [showBadges, setShowBadges] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [selectedDesafio, setSelectedDesafio] = useState<Desafio | null>(null);

  const streakMultiplier = getStreakMultiplier(pontuacao?.streak_dias || 0);

  return (
    <AppLayout>
      <div className="p-4 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Desafios</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFriends(true)}
          >
            <Users className="w-4 h-4 mr-1" />
            Amigos
          </Button>
        </div>

        {/* Gamification Header */}
        <GamificationHeader
          pontuacao={pontuacao}
          nivelAtual={nivelAtual}
          progressoNivel={progressoNivel}
          pontosProximoNivel={pontosProximoNivel}
          streakMultiplier={streakMultiplier}
        />

        {/* Progress Card */}
        <ProgressCard
          pontosTotais={pontuacao?.pontos_totais || 0}
          streakDias={pontuacao?.streak_dias || 0}
          multiplicador={streakMultiplier}
          userBadges={userBadges}
          totalBadges={badges.length}
          historico={historico}
          onBadgesClick={() => setShowBadges(true)}
        />

        {/* Rankings */}
        <RankingsCard generateRankings={generateRankings} loading={loading} />

        {/* Active Challenges */}
        <ActiveChallengesCard
          desafios={desafiosAtivos}
          onChallengeClick={setSelectedDesafio}
        />

        {/* FAB */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-4 z-40"
        >
          <Button
            size="lg"
            onClick={() => setShowCreateChallenge(true)}
            className="rounded-full w-14 h-14 shadow-lg btn-primary-gradient"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      {/* Modals */}
      <BadgesGalleryModal
        open={showBadges}
        onOpenChange={setShowBadges}
        badges={badges}
        userBadges={userBadges}
      />

      <CreateChallengeModal
        open={showCreateChallenge}
        onOpenChange={setShowCreateChallenge}
        amigos={amigos}
        onCreate={createDesafio}
      />

      <ChallengeDetailModal
        open={!!selectedDesafio}
        onOpenChange={() => setSelectedDesafio(null)}
        desafio={selectedDesafio}
        amigos={amigos}
        userProgress={0}
      />

      <LevelUpModal
        open={showLevelUp}
        onOpenChange={setShowLevelUp}
        level={newLevel}
        levelInfo={NIVEIS_INFO}
      />

      <FriendsModal
        open={showFriends}
        onOpenChange={setShowFriends}
        amigos={amigos}
        onChallenge={() => {
          setShowFriends(false);
          setShowCreateChallenge(true);
        }}
      />
    </AppLayout>
  );
}
