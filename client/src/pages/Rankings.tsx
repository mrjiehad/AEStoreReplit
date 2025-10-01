import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, Trophy, Crown } from "lucide-react";
import type { PlayerRanking } from "@shared/schema";

export default function Rankings() {
  const { data: rankings = [], isLoading } = useQuery<PlayerRanking[]>({
    queryKey: ["/api/rankings"],
  });

  const top3 = rankings.slice(0, 3);
  const restOfRankings = rankings.slice(3);

  const getPodiumOrder = (index: number) => {
    if (index === 0) return 1; // Winner in middle
    if (index === 1) return 0; // Second on left
    return 2; // Third on right
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header cartItemCount={0} onCartClick={() => {}} />
      
      <div className="container mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bebas text-neon-yellow mb-4" data-testid="title-rankings">
            RANKINGS
          </h1>
          <p className="text-gray-400 font-rajdhani text-lg uppercase tracking-wider">
            Top Players Leaderboard
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
            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <div className="mb-20">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bebas text-neon-yellow mb-2">
                    Top Players
                  </h2>
                </div>
                
                <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto items-end">
                  {top3.map((player, index) => {
                    const position = getPodiumOrder(index);
                    const isWinner = player.rank === 1;
                    const heights = ["h-64", "h-80", "h-56"];
                    
                    return (
                      <div
                        key={player.id}
                        className={`order-${position}`}
                        data-testid={`podium-${player.rank}`}
                      >
                        <div className={`relative ${heights[index]} bg-gradient-to-b from-[#1a2942] to-[#0d1d35] border-2 ${
                          isWinner ? 'border-neon-yellow' : 'border-white/20'
                        } rounded-t-3xl p-6 flex flex-col justify-end items-center transition-all duration-300 hover:border-neon-yellow/50`}>
                          {/* Crown for winner */}
                          {isWinner && (
                            <Crown className="absolute -top-8 w-16 h-16 text-neon-yellow" />
                          )}
                          
                          {/* Rank Badge */}
                          <div className={`absolute -top-6 w-12 h-12 rounded-full ${
                            isWinner ? 'bg-neon-yellow' : 'bg-gray-700'
                          } border-4 border-[#0a1628] flex items-center justify-center`}>
                            <span className={`text-2xl font-bold ${
                              isWinner ? 'text-black' : 'text-white'
                            }`}>{player.rank}</span>
                          </div>

                          {/* Player Name */}
                          <div className="text-center mb-4">
                            <p className="text-2xl font-bebas text-white tracking-wider truncate" data-testid={`player-name-${player.rank}`}>
                              {player.playerName}
                            </p>
                          </div>

                          {/* Stars */}
                          <div className="flex gap-1 flex-wrap justify-center mb-2">
                            {Array.from({ length: player.stars }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-neon-yellow text-neon-yellow"
                              />
                            ))}
                          </div>
                          <p className="text-gray-400 text-sm font-rajdhani uppercase">
                            {player.stars} Stars
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rankings Table */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-[#1a2942] to-[#0d1d35] border-2 border-white/10 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-neon-yellow/20">
                        <th className="py-6 px-6 text-left font-bebas text-xl text-neon-yellow uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="py-6 px-6 text-left font-bebas text-xl text-neon-yellow uppercase tracking-wider">
                          Username
                        </th>
                        <th className="py-6 px-6 text-left font-bebas text-xl text-neon-yellow uppercase tracking-wider">
                          Cumulative Stars
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {restOfRankings.map((player) => (
                        <tr
                          key={player.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          data-testid={`row-rank-${player.rank}`}
                        >
                          <td className="py-4 px-6">
                            <span className="text-2xl font-bold text-white font-bebas">
                              {player.rank}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-lg text-white font-rajdhani" data-testid={`player-name-${player.rank}`}>
                              {player.playerName}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {Array.from({ length: Math.min(player.stars, 10) }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-neon-yellow text-neon-yellow"
                                  />
                                ))}
                                {player.stars > 10 && (
                                  <span className="text-neon-yellow text-sm ml-1">
                                    +{player.stars - 10}
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
