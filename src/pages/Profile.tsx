
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Wallet, History, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Transaction history mock data
  const transactions = [
    { id: 1, type: 'Deposit', amount: 100, date: '2023-08-15', status: 'completed' },
    { id: 2, type: 'Game Entry', amount: -20, date: '2023-08-15', status: 'completed' },
    { id: 3, type: 'Game Win', amount: 80, date: '2023-08-15', status: 'completed' },
    { id: 4, type: 'Game Entry', amount: -20, date: '2023-08-14', status: 'completed' },
    { id: 5, type: 'Withdrawal', amount: -100, date: '2023-08-13', status: 'completed' },
    { id: 6, type: 'Referral Bonus', amount: 10, date: '2023-08-12', status: 'completed' },
  ];

  // Game history mock data
  const gameHistory = [
    { id: 1, category: 'Finance 🏦', date: '2023-08-15', position: 1, prize: 80 },
    { id: 2, type: 'Crypto 💰', date: '2023-08-14', position: 3, prize: 0 },
    { id: 3, type: 'Politics 🏛️', date: '2023-08-13', position: 2, prize: 40 },
    { id: 4, type: 'Sports ⚽', date: '2023-08-12', position: 5, prize: 0 },
    { id: 5, type: 'Business 📈', date: '2023-08-11', position: 1, prize: 80 },
  ];

  const handleWithdraw = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 50) {
      toast.error('Please enter a valid amount (minimum Ksh. 50)');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Withdrawal of Ksh. ${amount} has been initiated to ${user?.phoneNumber}`);
      setAmount('');
      setIsLoading(false);
    }, 1500);
  };

  const handleDeposit = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 20) {
      toast.error('Please enter a valid amount (minimum Ksh. 20)');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Deposit of Ksh. ${amount} has been initiated. Check your phone for STK push.`);
      setAmount('');
      setIsLoading(false);
    }, 1500);
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/?ref=${user?.username}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-trivia-text">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-trivia-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                  {user?.username?.[0].toUpperCase() || 'U'}
                </div>
                <h2 className="text-xl font-bold">{user?.username}</h2>
                <p className="text-trivia-muted">{user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={user?.username} disabled />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email} disabled />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={user?.phoneNumber} disabled />
                </div>
                
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Right Column - Tabs */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="wallet">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="wallet" className="flex items-center gap-2">
                    <Wallet size={16} />
                    <span>Wallet</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History size={16} />
                    <span>History</span>
                  </TabsTrigger>
                  <TabsTrigger value="referrals" className="flex items-center gap-2">
                    <Share2 size={16} />
                    <span>Referrals</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="wallet" className="space-y-6">
                  <div className="bg-gradient-to-r from-trivia-primary to-trivia-secondary rounded-lg p-6 text-white">
                    <h3 className="text-lg font-medium mb-1">Your Balance</h3>
                    <p className="text-3xl font-bold mb-4">Ksh. 0</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        className="border-white text-white hover:bg-white hover:text-trivia-primary flex-1"
                      >
                        Transaction History
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Deposit</CardTitle>
                        <CardDescription>Add funds to your account</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="depositAmount">Amount (KSH)</Label>
                          <Input 
                            id="depositAmount" 
                            type="number" 
                            placeholder="Min: Ksh. 20" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full bg-trivia-primary hover:bg-trivia-primary/90"
                          onClick={handleDeposit}
                          disabled={isLoading}
                        >
                          Deposit via M-Pesa
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Withdraw</CardTitle>
                        <CardDescription>Cash out your winnings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="withdrawAmount">Amount (KSH)</Label>
                          <Input 
                            id="withdrawAmount" 
                            type="number" 
                            placeholder="Min: Ksh. 50" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        <Button 
                          className="w-full bg-trivia-primary hover:bg-trivia-primary/90"
                          onClick={handleWithdraw}
                          disabled={isLoading}
                        >
                          Withdraw to M-Pesa
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 bg-muted p-3 font-medium">
                        <div>Type</div>
                        <div>Amount</div>
                        <div>Date</div>
                        <div>Status</div>
                      </div>
                      <div className="divide-y">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="grid grid-cols-4 p-3">
                            <div>{tx.type}</div>
                            <div className={tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {tx.amount >= 0 ? '+' : ''}{tx.amount} KSH
                            </div>
                            <div>{tx.date}</div>
                            <div className="capitalize">{tx.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Game History</h3>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 bg-muted p-3 font-medium">
                        <div>Category</div>
                        <div>Date</div>
                        <div>Position</div>
                        <div>Prize</div>
                      </div>
                      <div className="divide-y">
                        {gameHistory.map((game) => (
                          <div key={game.id} className="grid grid-cols-4 p-3">
                            <div>{game.category}</div>
                            <div>{game.date}</div>
                            <div>
                              {game.position === 1 && '🥇 '}
                              {game.position === 2 && '🥈 '}
                              {game.position === 3 && '🥉 '}
                              {game.position}
                            </div>
                            <div>
                              {game.prize > 0 ? (
                                <span className="text-green-600">+{game.prize} KSH</span>
                              ) : (
                                <span>-</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="referrals" className="space-y-6">
                  <Card className="bg-gradient-to-r from-trivia-primary/10 to-trivia-secondary/10 border-none">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Referral Program</h3>
                      <p className="text-trivia-muted mb-4">
                        Invite friends to TriviaCash and earn Ksh. 10 for each person who joins using your link!
                      </p>
                      
                      <div className="bg-white rounded-md p-3 mb-4">
                        <p className="text-sm font-medium mb-1">Your Referral Link:</p>
                        <code className="bg-muted p-2 rounded flex items-center justify-between">
                          <span className="text-xs md:text-sm truncate">
                            {window.location.origin}/?ref={user?.username}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={copyReferralLink}
                          >
                            Copy
                          </Button>
                        </code>
                      </div>
                      
                      <Button 
                        className="w-full bg-trivia-primary hover:bg-trivia-primary/90"
                        onClick={copyReferralLink}
                      >
                        Share Referral Link
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Referrals</h3>
                    <div className="border rounded-md p-6 text-center">
                      <p className="text-trivia-muted mb-2">You haven't referred anyone yet</p>
                      <p className="text-sm">Share your referral link to start earning bonuses!</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
