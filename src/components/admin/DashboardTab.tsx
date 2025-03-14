
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardTab = () => {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">256</div>
            <p className="text-xs text-trivia-muted mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Ksh. 27,500</div>
            <p className="text-xs text-trivia-muted mt-1">+5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">432</div>
            <p className="text-xs text-trivia-muted mt-1">+23% from last week</p>
          </CardContent>
        </Card>
      </div>
      
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

export default DashboardTab;
