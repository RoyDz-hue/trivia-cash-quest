
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
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

  console.log('Register component rendered, user:', user?.email, 'isAdmin:', isAdmin);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User is logged in, redirecting based on role:', isAdmin ? 'admin' : 'user');
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isAdmin, navigate]);

  // If still submitting after 5 seconds, reset the state to prevent permanently disabled buttons
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isSubmitting) {
      timeoutId = window.setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
    
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Submitting registration form for:', email);

    try {
      // Register the user
      await register(
        { username, email, phoneNumber },
        password
      );
      
      toast.success('Registration successful!');
      
      // Handle redirection with a delay to ensure auth state updates
      setTimeout(() => {
        // Handle immediate redirect for admin
        if (email === 'cyntoremix@gmail.com') {
          console.log('Admin registration detected, redirecting to /admin');
          navigate('/admin', { replace: true });
          return;
        }

        // Handle referral after successful registration
        if (referralCode && user?.id) {
          console.log('Processing referral code:', referralCode);
          try {
            // Get the referrer profile by username
            const { data: referrerProfile, error: referrerError } = supabase
              .from('profiles')
              .select('id')
              .eq('username', referralCode)
              .single();

            // Check if promises are resolved
            Promise.resolve(referrerProfile).then(profile => {
              if (profile && !referrerError) {
                // Record the referral in the database
                supabase
                  .from('referrals')
                  .insert({
                    referrer_id: profile.id,
                    referred_id: user.id,
                    bonus_amount: 10.00
                  })
                  .then(({ error: referralError }) => {
                    if (!referralError) {
                      toast.success(`Registered with referral code: ${referralCode}! You got 10 KSH bonus.`);
                    }
                  });
              }
            });
          } catch (referralProcessingError) {
            console.error('Error processing referral:', referralProcessingError);
            // Still continue with registration flow even if referral processing fails
          }
        }
        
        // Redirect regular users to dashboard
        console.log('Regular user registration, redirecting to /dashboard');
        navigate('/dashboard', { replace: true });

        // Finally release the submitting state if we're still on the page
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error: any) {
      console.error('Registration form submission error:', error);
      setError(error.message || 'Registration failed. Please try again.');
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-trivia-primary to-trivia-secondary hover:from-trivia-primary/90 hover:to-trivia-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : 'Register'}
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
