import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Star, Trophy, Crown, Medal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { PlayerRanking } from "@shared/schema";

import sultan1 from "@assets/S2_1759294544784.png";
import sultan2 from "@assets/S1_1759294544782.png";
import sultan3 from "@assets/S3_1759294544785.png";
import cityBg from "@assets/stock_images/gta_5_cityscape_los__a8b6c683.jpg";

interface PlayerRankingWithUser extends PlayerRanking {
  user?: {
    username: string;
    avatar: string | null;
  };
}

const characterImages = [sultan1, sultan2, sultan3, sultan1, sultan2];

export default function Rankings() {
  const { data: rankings = [], isLoading } = useQuery<PlayerRankingWithUser[]>({
    queryKey: ["/api/rankings"],
  });

  const top3 = rankings.slice(0, 3);
  const restOfRankings = rankings.slice(3);

  const getPodiumOrder = (rank: number) => {
    // Rank 1 = middle (order-2), Rank 2 = left (order-1), Rank 3 = right (order-3)
    if (rank === 1) return 'order-2';
    if (rank === 2) return 'order-1';
    return 'order-3';
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-neon-yellow";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#000000]">
      <Header cartItemCount={0} onCartClick={() => {}} />
      
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={cityBg} 
            alt="GTA City Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-[#000000]/90 to-[#000000]" />
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
                SULTAN
              </h1>
              <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-neon-yellow to-transparent" />
            </div>
            <p className="text-gray-300 font-rajdhani text-2xl uppercase tracking-widest mt-4">
              HALL OF TOP SULTAN
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
                      const orderClass = getPodiumOrder(player.rank);
                      const isWinner = player.rank === 1;
                      const heightClass = player.rank === 1 ? 'min-h-[400px]' : player.rank === 2 ? 'min-h-[350px]' : 'min-h-[320px]';
                      const characterImage = characterImages[index % characterImages.length];
                      
                      return (
                        <div
                          key={player.id}
                          className={`${orderClass} relative group`}
                          data-testid={`podium-${player.rank}`}
                        >
                          <div className={`relative ${heightClass} bg-gradient-to-br from-[#1a1a1a] via-[#000000] to-black border-4 ${
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

                              {/* Stars - Max 10 displayed */}
                              <div className="flex gap-1 flex-wrap justify-center mb-3">
                                {Array.from({ length: Math.min(player.stars, 10) }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`${isWinner ? 'w-7 h-7' : 'w-6 h-6'} fill-neon-yellow text-neon-yellow`}
                                    style={{ filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 1))" }}
                                  />
                                ))}
                                {player.stars > 10 && (
                                  <span className={`${isWinner ? 'text-2xl' : 'text-xl'} text-neon-yellow font-bold ml-1 font-bebas`}>
                                    +{player.stars - 10}
                                  </span>
                                )}
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
                <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#000000]/80 backdrop-blur-sm border-2 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
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
                              <td className="py-6 px-8 relative">
                                {/* Background character image on hover */}
                                <div className="absolute inset-0 left-0 right-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none -z-10" style={{ width: 'calc(300%)' }}>
                                  <img 
                                    src={characterImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
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
