
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';

const PaymentsTab = () => {
  const [depositChannelId, setDepositChannelId] = React.useState(paymentService.getDepositChannelId());
  const [withdrawalChannelId, setWithdrawalChannelId] = React.useState(paymentService.getWithdrawalChannelId());

  const savePaymentSettings = () => {
    paymentService.setDepositChannelId(depositChannelId);
    paymentService.setWithdrawalChannelId(withdrawalChannelId);
    toast.success('Payment settings saved successfully!');
  };

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Channel Configuration</CardTitle>
          <CardDescription>
            Configure PayHero channel IDs for deposits and withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositChannelId">Deposit Channel ID (M-Pesa STK Push)</Label>
            <Input 
              id="depositChannelId" 
              value={depositChannelId}
              onChange={(e) => setDepositChannelId(e.target.value)}
              placeholder="1487"
            />
            <p className="text-sm text-muted-foreground">Channel ID for processing deposits via M-Pesa STK Push</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="withdrawalChannelId">Withdrawal Channel ID (M-Pesa B2C)</Label>
            <Input 
              id="withdrawalChannelId" 
              value={withdrawalChannelId}
              onChange={(e) => setWithdrawalChannelId(e.target.value)}
              placeholder="1487"
            />
            <p className="text-sm text-muted-foreground">Channel ID for processing withdrawals via M-Pesa B2C</p>
          </div>
          
          <Button 
            onClick={savePaymentSettings}
            className="bg-trivia-primary hover:bg-trivia-primary/90"
          >
            Save Payment Settings
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Overview of the most recent payments and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted p-3 font-medium">
              <div>Type</div>
              <div>User</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-5 p-3">
                <div>Deposit</div>
                <div>user1</div>
                <div>Ksh. 100</div>
                <div className="text-green-600">Completed</div>
                <div>Today, 10:30 AM</div>
              </div>
              <div className="grid grid-cols-5 p-3">
                <div>Withdrawal</div>
                <div>user2</div>
                <div>Ksh. 250</div>
                <div className="text-green-600">Completed</div>
                <div>Today, 9:15 AM</div>
              </div>
              <div className="grid grid-cols-5 p-3">
                <div>Game Entry</div>
                <div>user3</div>
                <div>Ksh. 20</div>
                <div className="text-green-600">Completed</div>
                <div>Yesterday, 7:22 PM</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTab;
