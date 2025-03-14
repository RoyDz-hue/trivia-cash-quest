
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: string;
}

interface UsersTabProps {
  users: User[];
}

const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Browse and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search users..." 
                className="w-64" 
              />
              <Button variant="outline" size="sm">Search</Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted p-3 font-medium">
              <div>Username</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {users.map(user => (
                <div key={user.id} className="grid grid-cols-5 p-3">
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                  <div>{user.phoneNumber}</div>
                  <div className={user.status === 'flagged' ? 'text-amber-600' : 'text-green-600'}>
                    {user.status === 'flagged' ? 'Flagged' : 'Active'}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    {user.status === 'flagged' && (
                      <Button variant="outline" size="sm" className="text-red-500">
                        <XCircle size={16} className="mr-1" />
                        <span>Ban</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
