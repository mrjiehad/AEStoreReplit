import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, Trophy, Crown, Medal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { PlayerRanking } from "@shared/schema";

import trophyImage1 from "@assets/stock_images/gold_trophy_champion_d1a6c804.jpg";
import trophyImage2 from "@assets/stock_images/gold_trophy_champion_5128ff0d.jpg";
import trophyImage3 from "@assets/stock_images/gold_trophy_champion_8bd69346.jpg";
import character1 from "@assets/stock_images/gta_5_character_gang_ee85e2a1.jpg";
import character2 from "@assets/stock_images/gta_5_character_gang_ec0f6902.jpg";
import character3 from "@assets/stock_images/gta_5_character_gang_31e0d588.jpg";
import character4 from "@assets/stock_images/gta_5_character_gang_060f8c48.jpg";
import character5 from "@assets/stock_images/gta_5_character_gang_649de338.jpg";
import neonBg from "@assets/stock_images/neon_lights_cyberpun_f1af9a3d.jpg";

interface PlayerRankingWithUser extends PlayerRanking {
  user?: {
    username: string;
    avatar: string | null;
  };
}

const characterImages = [character1, character2, character3, character4, character5];
const trophyImages = [trophyImage1, trophyImage2, trophyImage3];

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
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header cartItemCount={0} onCartClick={() => {}} />
      
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={neonBg} 
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/90 to-[#0a1628]" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Title */}
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <Trophy className="w-24 h-24 text-neon-yellow mx-auto mb-6 animate-pulse" 
                     style={{ filter: "drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))" }} />
              <h1 className="text-7xl md:text-9xl font-bebas text-neon-yellow mb-4" 
                  style={{ textShadow: "0 0 40px rgba(255, 215, 0, 0.6)" }}
                  data-testid="title-rankings">
                RANKINGS
              </h1>
              <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-neon-yellow to-transparent" />
            </div>
            <p className="text-gray-300 font-rajdhani text-2xl uppercase tracking-widest mt-4">
              Hall of Champions
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-neon-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <p className="text-gray-400 text-2xl font-rajdhani">No rankings available yet</p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {top3.length > 0 && (
                <div className="mb-24">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-end">
                    {top3.map((player, index) => {
                      const position = getPodiumOrder(index);
                      const isWinner = player.rank === 1;
                      const heights = ["min-h-[500px]", "min-h-[600px]", "min-h-[450px]"];
                      const characterImage = characterImages[index % characterImages.length];
                      const trophyImage = trophyImages[index % trophyImages.length];
                      
                      return (
                        <div
                          key={player.id}
                          className={`order-${position} relative group`}
                          data-testid={`podium-${player.rank}`}
                        >
                          <div className={`relative ${heights[index]} bg-gradient-to-br from-[#1a2942] via-[#0d1d35] to-black border-4 ${
                            isWinner ? 'border-neon-yellow' : 'border-white/20'
                          } rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:border-neon-yellow`}
                          style={isWinner ? { 
                            boxShadow: "0 0 60px rgba(255, 215, 0, 0.4), inset 0 0 80px rgba(255, 215, 0, 0.1)" 
                          } : {
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
                          }}>
                            
                            {/* Character Background Image */}
                            <div className="absolute inset-0">
                              <img 
                                src={characterImage} 
                                alt={player.playerName}
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t ${
                                isWinner 
                                  ? 'from-black via-black/80 to-transparent' 
                                  : 'from-black via-black/60 to-transparent'
                              }`} />
                            </div>

                            {/* Rank Badge */}
                            <div className="absolute top-6 right-6 z-10">
                              <div className={`w-16 h-16 rounded-full ${
                                isWinner ? 'bg-neon-yellow' : 'bg-gray-700'
                              } border-4 border-black flex items-center justify-center shadow-2xl`}>
                                <span className={`text-3xl font-bold font-bebas ${
                                  isWinner ? 'text-black' : 'text-white'
                                }`}>#{player.rank}</span>
                              </div>
                            </div>

                            {/* Trophy Image */}
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-30">
                              <img 
                                src={trophyImage} 
                                alt="Trophy"
                                className="w-40 h-40 object-contain"
                              />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                              {/* Player Name */}
                              <div className="text-center mb-4">
                                <p className={`${isWinner ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} font-bebas text-white tracking-wider mb-2`} 
                                   data-testid={`player-name-${player.rank}`}
                                   style={isWinner ? { textShadow: "0 0 30px rgba(255, 215, 0, 0.8)" } : { textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)" }}>
                                  {player.playerName}
                                </p>
                                <div className={`inline-block px-4 py-1 rounded-full ${
                                  isWinner ? 'bg-neon-yellow/20 border border-neon-yellow' : 'bg-white/10 border border-white/20'
                                }`}>
                                  <span className={`font-rajdhani font-bold text-sm uppercase ${
                                    isWinner ? 'text-neon-yellow' : 'text-gray-300'
                                  }`}>
                                    {isWinner ? 'Champion' : `Rank ${player.rank}`}
                                  </span>
                                </div>
                              </div>

                              {/* Stars */}
                              <div className="flex gap-1 flex-wrap justify-center mb-3">
                                {Array.from({ length: player.stars }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`${isWinner ? 'w-7 h-7' : 'w-6 h-6'} fill-neon-yellow text-neon-yellow`}
                                    style={{ filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 1))" }}
                                  />
                                ))}
                              </div>
                              <p className={`text-neon-yellow font-bebas text-center ${
                                isWinner ? 'text-3xl' : 'text-2xl'
                              }`}>
                                {player.stars} STARS
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rankings Table */}
              <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-[#1a2942]/80 to-[#0d1d35]/80 backdrop-blur-sm border-2 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-neon-yellow/30 bg-black/40">
                          <th className="py-6 px-8 text-left font-bebas text-2xl text-neon-yellow uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="py-6 px-8 text-left font-bebas text-2xl text-neon-yellow uppercase tracking-wider">
                            Player
                          </th>
                          <th className="py-6 px-8 text-left font-bebas text-2xl text-neon-yellow uppercase tracking-wider">
                            Stars
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {restOfRankings.map((player, index) => {
                          const characterImage = characterImages[(index + 3) % characterImages.length];
                          
                          return (
                            <tr
                              key={player.id}
                              className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 group relative"
                              data-testid={`row-rank-${player.rank}`}
                            >
                              {/* Background character image on hover */}
                              <td colSpan={3} className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                                  <img 
                                    src={characterImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </td>

                              <td className="py-6 px-8 relative">
                                <div className="flex items-center gap-4">
                                  {player.rank <= 6 && (
                                    <Medal className={`w-8 h-8 ${getMedalColor(player.rank)}`} />
                                  )}
                                  <span className={`text-3xl font-bold font-bebas ${getMedalColor(player.rank)}`}>
                                    #{player.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="py-6 px-8 relative">
                                <div className="flex items-center gap-5">
                                  <div className="relative">
                                    <Avatar className="w-16 h-16 ring-4 ring-white/20 group-hover:ring-neon-yellow/50 transition-all shadow-xl">
                                      <AvatarImage src={player.user?.avatar || undefined} />
                                      <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-white font-bold text-xl">
                                        {player.playerName.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <span className="text-2xl text-white font-rajdhani font-bold group-hover:text-neon-yellow transition-colors" 
                                        data-testid={`player-name-${player.rank}`}>
                                    {player.playerName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-6 px-8 relative">
                                <div className="flex items-center gap-3">
                                  <div className="flex gap-1.5">
                                    {Array.from({ length: Math.min(player.stars, 7) }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-6 h-6 fill-neon-yellow text-neon-yellow"
                                        style={{ filter: "drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))" }}
                                      />
                                    ))}
                                    {player.stars > 7 && (
                                      <span className="text-neon-yellow font-bold text-xl ml-2 font-bebas">
                                        +{player.stars - 7}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
