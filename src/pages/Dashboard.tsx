
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { toast } from 'sonner';
import { Users, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock categories for the demo
  const categories: Category[] = [
    {
      id: '1',
      name: 'Finance',
      icon: '🏦',
      description: 'Test your knowledge of financial concepts, markets, and economics.',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '2',
      name: 'Crypto',
      icon: '💰',
      description: 'How much do you know about cryptocurrencies, blockchain, and the digital economy?',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '3',
      name: 'Politics',
      icon: '🏛️',
      description: 'Test your knowledge of local and global politics, governments, and policies.',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '4',
      name: 'Sports',
      icon: '⚽',
      description: 'From football to athletics, test your sports knowledge and win big!',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '5',
      name: 'Business',
      icon: '📈',
      description: 'Companies, entrepreneurs, and market trends - how much do you know?',
      entryFee: 20,
      minPlayers: 5,
    },
    {
      id: '6',
      name: 'Elections',
      icon: '🗳️',
      description: 'Test your knowledge about elections, voting systems, and democratic processes.',
      entryFee: 20,
      minPlayers: 5,
    },
  ];

  // Mock game data
  const game = {
    id: '123',
    categoryId: '1',
    status: 'waiting' as const,
    players: [
      { id: '1', username: 'player1', email: 'player1@example.com', phoneNumber: '+254700000001' },
      { id: '2', username: 'player2', email: 'player2@example.com', phoneNumber: '+254700000002' },
      { id: '3', username: 'player3', email: 'player3@example.com', phoneNumber: '+254700000003' },
    ],
    timeToStart: 30,
  };

  const handleJoinGame = (categoryId: string) => {
    setSelectedCategory(categoryId);
    toast.success(`Joined the ${categories.find(c => c.id === categoryId)?.name} game! Waiting for more players.`);
  };

  const handleLeaveGame = () => {
    setSelectedCategory(null);
    toast.info('You left the game');
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${user?.username}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-trivia-text">Welcome, {user?.username}!</h1>
            <p className="text-trivia-muted mt-1">
              Choose a category and start winning today.
            </p>
          </div>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex flex-row items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium">Your Balance</p>
                <h3 className="text-2xl font-bold">Ksh. 0</h3>
              </div>
              <Button variant="outline" size="sm">
                Add Funds
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Referral Card */}
        <Card className="bg-gradient-to-r from-trivia-primary/10 to-trivia-secondary/10 border-none">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Earn by Referring Friends</h3>
                <p className="text-sm text-trivia-muted">
                  Invite friends and earn Ksh. 10 for each person who joins using your link!
                </p>
              </div>
              <Button 
                className="bg-trivia-primary hover:bg-trivia-primary/90"
                onClick={copyReferralLink}
              >
                Copy Referral Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedCategory ? (
          /* Game Waiting Room */
          <Card>
            <CardHeader>
              <CardTitle>Waiting for Players</CardTitle>
              <CardDescription>
                Category: {categories.find(c => c.id === selectedCategory)?.name} {categories.find(c => c.id === selectedCategory)?.icon}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>
                    {game.players.length}/{categories.find(c => c.id === selectedCategory)?.minPlayers} Players
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>Starts in: {game.timeToStart}s</span>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Current Players:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {game.players.map((player) => (
                    <div key={player.id} className="bg-muted px-3 py-2 rounded-md text-sm">
                      {player.username}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-amber-50 text-amber-800 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Important:</p>
                  <p className="text-sm">
                    Do not leave this page or switch tabs during the game. 
                    This will result in disqualification.
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleLeaveGame}
              >
                Leave Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Categories Grid */
          <div>
            <h2 className="text-2xl font-bold mb-4">Select a Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {category.name} <span className="text-2xl">{category.icon}</span>
                        </h3>
                        <p className="text-sm text-trivia-muted mt-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div>
                        <p className="text-sm font-medium">Entry Fee</p>
                        <p className="font-bold">Ksh. {category.entryFee}</p>
                      </div>
                      <Button 
                        className="bg-trivia-primary hover:bg-trivia-primary/90"
                        onClick={() => handleJoinGame(category.id)}
                      >
                        Join Game
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
