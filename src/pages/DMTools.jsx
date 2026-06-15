import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, ScrollText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import DMToolsGate from '@/components/dm/DMToolsGate';
import LetterManager from '@/components/dm/LetterManager';

export default function DMTools() {
  return (
    <DMToolsGate>
      <DMDashboard />
    </DMToolsGate>
  );
}

function DMDashboard() {
  const [editing, setEditing] = useState(null); // null, 'new', or letter object
  const queryClient = useQueryClient();

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: () => base44.entities.Letter.list('letter_number'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Letter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] });
      toast.success('Letter deleted');
    },
  });

  if (editing) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 max-w-3xl mx-auto">
        <LetterManager
          letter={editing === 'new' ? null : editing}
          onDone={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Shield className="w-5 h-5 text-accent" />
            <h1 className="font-heading text-xl tracking-wider">DM Tools</h1>
          </div>
          <Button
            onClick={() => setEditing('new')}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-heading text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 mr-2" /> New Letter
          </Button>
        </div>

        {/* Letters list */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : letters.length === 0 ? (
          <div className="text-center py-20">
            <ScrollText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No letters created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => (
              <Card key={letter.id} className="bg-card border-border">
                <CardContent className="flex items-center gap-4 py-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-20 rounded-md overflow-hidden border border-border flex-shrink-0 bg-muted">
                    {letter.censored_pages?.[0] ? (
                      <img src={letter.censored_pages[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ScrollText className="w-5 h-5 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm font-semibold truncate">{letter.title}</h3>
                      <Badge variant={letter.is_published ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                        {letter.is_published ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {letter.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Password: <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-[11px]">{letter.password}</code>
                      {letter.password_hint && <span className="ml-2 italic">Hint: {letter.password_hint}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {letter.censored_pages?.length || 0} censored · {letter.uncensored_pages?.length || 0} uncensored pages
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(letter)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Delete this letter?')) deleteMutation.mutate(letter.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}