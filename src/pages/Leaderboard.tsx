
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Medal, Award, User } from 'lucide-react';

const Leaderboard = () => {
  // Mock leaderboard data
  const dailyLeaders = [
    { rank: 1, username: 'john_doe', wins: 12, earnings: 4500 },
    { rank: 2, username: 'crypto_queen', wins: 10, earnings: 3800 },
    { rank: 3, username: 'trivia_master', wins: 9, earnings: 3200 },
    { rank: 4, username: 'knowledge_king', wins: 8, earnings: 2700 },
    { rank: 5, username: 'quiz_wizard', wins: 7, earnings: 2300 },
    { rank: 6, username: 'brain_storm', wins: 7, earnings: 2100 },
    { rank: 7, username: 'smart_player', wins: 6, earnings: 1950 },
    { rank: 8, username: 'quick_thinker', wins: 5, earnings: 1800 },
    { rank: 9, username: 'fact_finder', wins: 5, earnings: 1750 },
    { rank: 10, username: 'trivia_champ', wins: 4, earnings: 1500 },
  ];

  const weeklyLeaders = [
    { rank: 1, username: 'trivia_master', wins: 45, earnings: 16500 },
    { rank: 2, username: 'john_doe', wins: 42, earnings: 15200 },
    { rank: 3, username: 'crypto_queen', wins: 38, earnings: 14100 },
    { rank: 4, username: 'knowledge_king', wins: 36, earnings: 12800 },
    { rank: 5, username: 'quiz_wizard', wins: 34, earnings: 11900 },
    { rank: 6, username: 'brain_storm', wins: 33, earnings: 11500 },
    { rank: 7, username: 'smart_player', wins: 31, earnings: 10800 },
    { rank: 8, username: 'quick_thinker', wins: 29, earnings: 9900 },
    { rank: 9, username: 'fact_finder', wins: 27, earnings: 9200 },
    { rank: 10, username: 'trivia_champ', wins: 25, earnings: 8700 },
  ];

  const allTimeLeaders = [
    { rank: 1, username: 'trivia_master', wins: 312, earnings: 105000 },
    { rank: 2, username: 'crypto_queen', wins: 287, earnings: 95500 },
    { rank: 3, username: 'john_doe', wins: 256, earnings: 82000 },
    { rank: 4, username: 'knowledge_king', wins: 243, earnings: 78000 },
    { rank: 5, username: 'quiz_wizard', wins: 218, earnings: 67500 },
    { rank: 6, username: 'brain_storm', wins: 196, earnings: 62000 },
    { rank: 7, username: 'smart_player', wins: 184, earnings: 59000 },
    { rank: 8, username: 'quick_thinker', wins: 162, earnings: 51500 },
    { rank: 9, username: 'fact_finder', wins: 143, earnings: 45000 },
    { rank: 10, username: 'trivia_champ', wins: 129, earnings: 42000 },
  ];

  const renderLeaderIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderLeaderboardTable = (leaders: typeof dailyLeaders) => (
    <div className="rounded-md border">
      <div className="grid grid-cols-4 bg-muted p-3 font-medium">
        <div>Rank</div>
        <div>Player</div>
        <div>Wins</div>
        <div>Earnings</div>
      </div>
      <div className="divide-y">
        {leaders.map((leader) => (
          <div 
            key={leader.rank} 
            className={`grid grid-cols-4 p-3 ${leader.rank <= 3 ? 'bg-trivia-background' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span>{leader.rank}</span>
              {renderLeaderIcon(leader.rank)}
            </div>
            <div className="font-medium">{leader.username}</div>
            <div>{leader.wins}</div>
            <div>Ksh. {leader.earnings}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-trivia-text">Leaderboard</h1>
          <p className="text-trivia-muted mt-1">
            See who's winning and earning the most on TriviaCash
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Players</CardTitle>
            <CardDescription>
              View the top performing players across different time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="allTime">All Time</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Today's Top Players</h3>
                    <p className="text-sm text-trivia-muted">Updated every hour</p>
                  </div>
                  {renderLeaderboardTable(dailyLeaders)}
                </div>
              </TabsContent>
              
              <TabsContent value="weekly">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">This Week's Top Players</h3>
                    <p className="text-sm text-trivia-muted">Updated daily</p>
                  </div>
                  {renderLeaderboardTable(weeklyLeaders)}
                </div>
              </TabsContent>
              
              <TabsContent value="allTime">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">All-Time Top Players</h3>
                    <p className="text-sm text-trivia-muted">Since platform launch</p>
                  </div>
                  {renderLeaderboardTable(allTimeLeaders)}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Champions</CardTitle>
            <CardDescription>
              The best players in each trivia category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-trivia-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏦</span>
                  <h3 className="font-semibold">Finance</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">crypto_queen</span>
                  </div>
                  <p className="text-sm text-trivia-muted">87 wins • Ksh. 32,500 earned</p>
                </div>
              </div>
              
              <div className="bg-trivia-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-semibold">Crypto</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">john_doe</span>
                  </div>
                  <p className="text-sm text-trivia-muted">92 wins • Ksh. 36,800 earned</p>
                </div>
              </div>
              
              <div className="bg-trivia-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏛️</span>
                  <h3 className="font-semibold">Politics</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">trivia_master</span>
                  </div>
                  <p className="text-sm text-trivia-muted">104 wins • Ksh. 41,200 earned</p>
                </div>
              </div>
              
              <div className="bg-trivia-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📚</span>
                  <h3 className="font-semibold">Education</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">knowledge_king</span>
                  </div>
                  <p className="text-sm text-trivia-muted">76 wins • Ksh. 28,900 earned</p>
                </div>
              </div>
              
              <div className="bg-trivia-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚽</span>
                  <h3 className="font-semibold">Sports</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">quick_thinker</span>
                  </div>
                  <p className="text-sm text-trivia-muted">81 wins • Ksh. 30,500 earned</p>
                </div>
              </div>
              
              <div className="bg-trivia-background rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📈</span>
                  <h3 className="font-semibold">Business</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">brain_storm</span>
                  </div>
                  <p className="text-sm text-trivia-muted">67 wins • Ksh. 25,200 earned</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;
