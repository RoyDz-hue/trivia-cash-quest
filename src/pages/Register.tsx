
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract referral code from URL if present
  const queryParams = new URLSearchParams(location.search);
  const referralCode = queryParams.get('ref');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      // If admin, redirect to admin dashboard
      if (isAdmin) {
        navigate('/admin');
      } else {
        // If regular user, redirect to regular dashboard
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await register(
        { username, email, phoneNumber },
        password
      );
      
      // If there's a referral code, record the referral
      if (referralCode && user?.id) {
        // Get the referrer profile by username
        const { data: referrerProfile, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', referralCode)
          .single();

        if (referrerProfile && !referrerError) {
          // Record the referral in the database
          const { error: referralError } = await supabase
            .from('referrals')
            .insert({
              referrer_id: referrerProfile.id,
              referred_id: user.id,
              bonus_amount: 10.00
            });

          if (!referralError) {
            toast.success(`Registered with referral code: ${referralCode}! You got 10 KSH bonus.`);
          }
        }
      } else {
        toast.success('Registration successful!');
      }
      
      // The user and isAdmin state will be updated after registration
      // We'll handle the redirect in the useEffect above
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-trivia-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Register to start playing and winning on TriviaCash
          </CardDescription>
          {referralCode && (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-center text-sm mt-2">
              Referral code applied: {referralCode}
              <br/>
              <span className="font-medium">You'll get 10 KSH bonus!</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your display name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (for payments)</Label>
              <Input
                id="phoneNumber"
                placeholder="+254700000000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-trivia-primary to-trivia-secondary hover:from-trivia-primary/90 hover:to-trivia-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-trivia-primary hover:text-trivia-secondary">
              Login instead
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
