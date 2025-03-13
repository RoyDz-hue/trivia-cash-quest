import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Wallet, History, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { paymentService, TransactionStatus } from '@/services/paymentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Profile = () => {
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      paymentService.stopAllStatusChecks();
    };
  }, []);

  const transactions = [
    { id: 1, type: 'Deposit', amount: 100, date: '2023-08-15', status: 'completed' },
    { id: 2, type: 'Game Entry', amount: -20, date: '2023-08-15', status: 'completed' },
    { id: 3, type: 'Game Win', amount: 80, date: '2023-08-15', status: 'completed' },
    { id: 4, type: 'Game Entry', amount: -20, date: '2023-08-14', status: 'completed' },
    { id: 5, type: 'Withdrawal', amount: -100, date: '2023-08-13', status: 'completed' },
    { id: 6, type: 'Referral Bonus', amount: 10, date: '2023-08-12', status: 'completed' },
  ];

  const gameHistory = [
    { id: 1, category: 'Finance 🏦', date: '2023-08-15', position: 1, prize: 80 },
    { id: 2, type: 'Crypto 💰', date: '2023-08-14', position: 3, prize: 0 },
    { id: 3, type: 'Politics 🏛️', date: '2023-08-13', position: 2, prize: 40 },
    { id: 4, type: 'Sports ⚽', date: '2023-08-12', position: 5, prize: 0 },
    { id: 5, type: 'Business 📈', date: '2023-08-11', position: 1, prize: 80 },
  ];

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) < 50) {
      toast.error('Please enter a valid amount (minimum Ksh. 50)');
      return;
    }
    
    if (!user?.phoneNumber) {
      toast.error('Phone number not found. Please update your profile.');
      return;
    }
    
    setIsWithdrawLoading(true);
    setTransactionError(null);
    
    try {
      const response = await paymentService.withdrawToMobile(
        parseFloat(withdrawAmount), 
        user.phoneNumber
      );
      
      if (response.success && response.data) {
        toast.success(`Withdrawal of Ksh. ${withdrawAmount} has been initiated to ${user.phoneNumber}`);
        setPendingTransaction(response.data.merchant_reference);
        
        paymentService.startStatusCheck(
          response.data.merchant_reference,
          (status) => {
            if (status === TransactionStatus.SUCCESS) {
              setPendingTransaction(null);
              toast.success(`Withdrawal of Ksh. ${withdrawAmount} successful!`);
              setWithdrawAmount('');
            } else if (status === TransactionStatus.FAILED) {
              setPendingTransaction(null);
              toast.error('Withdrawal failed. Please try again.');
            }
          }
        );
      } else {
        setTransactionError(response.error || 'Failed to initiate withdrawal');
        toast.error(response.error || 'Failed to initiate withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setTransactionError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to process withdrawal. Please try again.');
    } finally {
      setIsWithdrawLoading(false);
    }
  };

  const handleDeposit = async () => {
    setTransactionError(null);
    
    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) < 20) {
      toast.error('Please enter a valid amount (minimum Ksh. 20)');
      return;
    }
    
    if (!user?.phoneNumber) {
      toast.error('Phone number not found. Please update your profile.');
      return;
    }
    
    setIsDepositLoading(true);
    
    try {
      const response = await paymentService.initiateSTKPush(
        parseFloat(depositAmount), 
        user.phoneNumber
      );
      
      if (response.success && response.data) {
        toast.success('STK push initiated. Please check your phone to complete the transaction.');
        setPendingTransaction(response.data.reference);
        
        paymentService.startStatusCheck(
          response.data.reference,
          (status) => {
            if (status === TransactionStatus.SUCCESS) {
              setPendingTransaction(null);
              toast.success(`Deposit of Ksh. ${depositAmount} successful!`);
              setDepositAmount('');
            } else if (status === TransactionStatus.FAILED) {
              setPendingTransaction(null);
              toast.error('Transaction failed. Please try again.');
            }
          }
        );
      } else {
        setTransactionError(response.error || 'Failed to initiate payment');
        toast.error(response.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setTransactionError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsDepositLoading(false);
    }
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
                  
                  {pendingTransaction && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTitle className="text-yellow-800">Transaction in Progress</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        Please check your phone and complete the payment process. 
                        This status will update automatically.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {transactionError && (
                    <Alert variant="destructive">
                      <AlertTitle>Transaction Error</AlertTitle>
                      <AlertDescription>{transactionError}</AlertDescription>
                    </Alert>
                  )}
                  
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
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            disabled={isDepositLoading || !!pendingTransaction}
                          />
                        </div>
                        <Button 
                          className="w-full bg-trivia-primary hover:bg-trivia-primary/90"
                          onClick={handleDeposit}
                          disabled={isDepositLoading || !!pendingTransaction}
                        >
                          {isDepositLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {pendingTransaction ? 'Processing...' : 'Deposit via M-Pesa'}
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
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            disabled={isWithdrawLoading || !!pendingTransaction}
                          />
                        </div>
                        <Button 
                          className="w-full bg-trivia-primary hover:bg-trivia-primary/90"
                          onClick={handleWithdraw}
                          disabled={isWithdrawLoading || !!pendingTransaction}
                        >
                          {isWithdrawLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
