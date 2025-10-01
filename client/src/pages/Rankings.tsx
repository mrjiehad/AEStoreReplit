import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, Trophy, Crown, Medal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { PlayerRanking } from "@shared/schema";

interface PlayerRankingWithUser extends PlayerRanking {
  user?: {
    username: string;
    avatar: string | null;
  };
}

export default function Rankings() {
  const { data: rankings = [], isLoading } = useQuery<PlayerRankingWithUser[]>({
    queryKey: ["/api/rankings"],
  });

  const top3 = rankings.slice(0, 3);
  const restOfRankings = rankings.slice(3);

  const getPodiumOrder = (index: number) => {
    if (index === 0) return 1;
    if (index === 1) return 0;
    return 2;
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-neon-yellow";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-gray-600";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-neon-yellow" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header cartItemCount={0} onCartClick={() => {}} />
      
      <div className="container mx-auto px-4 py-16">
        {/* Title with animated background */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-yellow/5 to-transparent blur-3xl" />
          <h1 className="text-6xl md:text-8xl font-bebas text-neon-yellow mb-4 relative" 
              style={{ textShadow: "0 0 30px rgba(255, 215, 0, 0.5)" }}
              data-testid="title-rankings">
            RANKINGS
          </h1>
          <p className="text-gray-400 font-rajdhani text-lg uppercase tracking-wider relative">
            Hall of Champions
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-neon-yellow border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-rajdhani">No rankings available yet</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium with Avatars */}
            {top3.length > 0 && (
              <div className="mb-20">
                <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto items-end">
                  {top3.map((player, index) => {
                    const position = getPodiumOrder(index);
                    const isWinner = player.rank === 1;
                    const heights = ["h-72", "h-96", "h-64"];
                    const avatarSizes = ["w-24 h-24", "w-32 h-32", "w-20 h-20"];
                    
                    return (
                      <div
                        key={player.id}
                        className={`order-${position}`}
                        data-testid={`podium-${player.rank}`}
                      >
                        <div className="relative mb-4">
                          {/* Crown for winner */}
                          {isWinner && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                              <Crown className="w-16 h-16 text-neon-yellow animate-pulse" 
                                     style={{ filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))" }} />
                            </div>
                          )}
                          
                          {/* Avatar */}
                          <div className="flex justify-center">
                            <div className={`relative ${avatarSizes[index]}`}>
                              <Avatar className={`${avatarSizes[index]} ring-4 ${
                                isWinner ? 'ring-neon-yellow' : 'ring-white/20'
                              } shadow-2xl`}
                              style={isWinner ? { boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)" } : {}}>
                                <AvatarImage src={player.user?.avatar || undefined} />
                                <AvatarFallback className={`${
                                  isWinner ? 'bg-neon-yellow text-black' : 'bg-gray-700 text-white'
                                } font-bold text-2xl`}>
                                  {player.playerName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {/* Rank Badge */}
                              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${
                                isWinner ? 'bg-neon-yellow' : 'bg-gray-700'
                              } border-4 border-[#0a1628] flex items-center justify-center shadow-lg`}>
                                <span className={`text-xl font-bold ${
                                  isWinner ? 'text-black' : 'text-white'
                                }`}>{player.rank}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`relative ${heights[index]} bg-gradient-to-b from-[#1a2942] to-[#0d1d35] border-2 ${
                          isWinner ? 'border-neon-yellow' : 'border-white/20'
                        } rounded-t-3xl p-6 flex flex-col justify-end items-center transition-all duration-300 hover:border-neon-yellow/50 overflow-hidden`}
                        style={isWinner ? { boxShadow: "0 0 40px rgba(255, 215, 0, 0.2)" } : {}}>
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                              backgroundImage: "repeating-linear-gradient(45deg, #FFD700 0, #FFD700 1px, transparent 0, transparent 50%)",
                              backgroundSize: "10px 10px"
                            }} />
                          </div>

                          {/* Player Name */}
                          <div className="text-center mb-4 relative z-10">
                            <p className={`${isWinner ? 'text-3xl' : 'text-2xl'} font-bebas text-white tracking-wider truncate px-4`} 
                               data-testid={`player-name-${player.rank}`}
                               style={isWinner ? { textShadow: "0 0 20px rgba(255, 215, 0, 0.5)" } : {}}>
                              {player.playerName}
                            </p>
                          </div>

                          {/* Stars */}
                          <div className="flex gap-1 flex-wrap justify-center mb-3 relative z-10">
                            {Array.from({ length: player.stars }).map((_, i) => (
                              <Star
                                key={i}
                                className={`${isWinner ? 'w-6 h-6' : 'w-5 h-5'} fill-neon-yellow text-neon-yellow`}
                                style={{ filter: "drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))" }}
                              />
                            ))}
                          </div>
                          <p className={`text-neon-yellow font-bebas text-xl uppercase relative z-10 ${
                            isWinner ? 'text-2xl' : ''
                          }`}>
                            {player.stars} Stars
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rankings Table with Avatars */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-neon-yellow/20 bg-black/20">
                        <th className="py-6 px-6 text-left font-bebas text-xl text-neon-yellow uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="py-6 px-6 text-left font-bebas text-xl text-neon-yellow uppercase tracking-wider">
                          Player
                        </th>
                        <th className="py-6 px-6 text-left font-bebas text-xl text-neon-yellow uppercase tracking-wider">
                          Stars
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {restOfRankings.map((player, index) => (
                        <tr
                          key={player.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group"
                          data-testid={`row-rank-${player.rank}`}
                        >
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              {getRankBadge(player.rank)}
                              <span className={`text-2xl font-bold font-bebas ${getMedalColor(player.rank)}`}>
                                #{player.rank}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 ring-2 ring-white/10 group-hover:ring-neon-yellow/30 transition-all">
                                <AvatarImage src={player.user?.avatar || undefined} />
                                <AvatarFallback className="bg-gray-700 text-white font-bold">
                                  {player.playerName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xl text-white font-rajdhani font-semibold group-hover:text-neon-yellow transition-colors" 
                                    data-testid={`player-name-${player.rank}`}>
                                {player.playerName}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                {Array.from({ length: Math.min(player.stars, 8) }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-5 h-5 fill-neon-yellow text-neon-yellow"
                                    style={{ filter: "drop-shadow(0 0 3px rgba(255, 215, 0, 0.6))" }}
                                  />
                                ))}
                                {player.stars > 8 && (
                                  <span className="text-neon-yellow font-bold text-lg ml-1 font-bebas">
                                    +{player.stars - 8}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
