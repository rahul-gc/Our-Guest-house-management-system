import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mountain, User, Shield, Users, Mail, Lock, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail || !registerPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setRegisterLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: registerName.trim(),
            role: 'user'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please login.');
        } else {
          toast.error('Registration failed: ' + error.message);
        }
      } else {
        toast.success('Account created! Please wait a moment, then try logging in.');
        
        // Clear form
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterName('');
        
        // Switch to login tab after a short delay
        setTimeout(() => {
          // The tab will switch automatically when user clicks login tab
        }, 2000);
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-gradient p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      <Card className="w-full max-w-md animate-fade-in shadow-2xl border-0 relative z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Mountain className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-serif text-slate-800">New Chitwan</h1>
          <p className="text-amber-600 text-sm mt-1 font-medium tracking-wide uppercase">Luxury Guest House</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              {/* Account Types Info */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Admin:</span>
                  <span className="text-muted-foreground">Staff Login</span>
                  <Badge variant="secondary">Full Access</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Guest:</span>
                  <span className="text-muted-foreground">Your registered email</span>
                  <Badge variant="outline">Booking Only</Badge>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="text-center mb-4">
                <UserPlus className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium">Create Guest Account</h3>
                <p className="text-sm text-muted-foreground">Book rooms and manage your reservations</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <Input
                    type="text"
                    value={registerName}
                    onChange={e => setRegisterName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    disabled={registerLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    value={registerEmail}
                    onChange={e => setRegisterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={registerLoading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <Input
                    type="password"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    required
                    disabled={registerLoading}
                  />
                </div>
                <Button type="submit" className="w-full mt-2" size="lg" disabled={registerLoading}>
                  {registerLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Guest accounts can book rooms • Admin accounts have full management access
            </p>
            <div className="mt-2">
              <span className="text-sm text-foreground/90 font-medium">Created by Rahul GC © 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
