import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, KeyRound } from 'lucide-react';

const DM_PASSWORD = 'nethdria_dm_2024';

export default function DMToolsGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === DM_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect. The wards hold.');
      setPassword('');
    }
  };

  if (authenticated) return children;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-heading text-xl tracking-wider text-foreground">DM Access</h2>
          <p className="text-sm text-muted-foreground mt-2 font-body italic">
            These tools are warded. Prove your authority.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter DM password..."
              className="pl-10 bg-muted/50 border-border focus:border-accent"
            />
          </div>
          {error && <p className="text-xs text-destructive text-center italic">{error}</p>}
          <Button type="submit" className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-heading text-xs uppercase tracking-wider">
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}