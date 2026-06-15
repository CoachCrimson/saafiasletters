import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, ScrollText, Shield, BookOpen, Users, Image, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import DMToolsGate from '@/components/dm/DMToolsGate';
import LetterManager from '@/components/dm/LetterManager';
import StoryManager from '@/components/dm/StoryManager';
import CharacterManager from '@/components/dm/CharacterManager';
import ArtManager from '@/components/dm/ArtManager';

const TABS = [
  { key: 'letters', label: 'Letters', icon: ScrollText },
  { key: 'stories', label: 'Stories', icon: BookOpen },
  { key: 'characters', label: 'Characters', icon: Users },
  { key: 'art', label: 'Art', icon: Image },
];

export default function DMTools() {
  return (
    <DMToolsGate>
      <DMDashboard />
    </DMToolsGate>
  );
}

function DMDashboard() {
  const [tab, setTab] = useState('letters');
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data: letters = [], isLoading: lettersLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: () => base44.entities.Letter.list('letter_number'),
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list('order'),
  });

  const { data: characters = [], isLoading: charsLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => base44.entities.Character.list('order'),
  });

  const { data: art = [], isLoading: artLoading } = useQuery({
    queryKey: ['art'],
    queryFn: () => base44.entities.Art.list('order'),
  });

  const currentData = tab === 'letters' ? letters : tab === 'stories' ? stories : tab === 'characters' ? characters : art;
  const currentLoading = tab === 'letters' ? lettersLoading : tab === 'stories' ? storiesLoading : tab === 'characters' ? charsLoading : artLoading;

  const deleteLetterMutation = useMutation({
    mutationFn: (id) => base44.entities.Letter.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['letters'] }); toast.success('Deleted'); },
  });
  const deleteStoryMutation = useMutation({
    mutationFn: (id) => base44.entities.Story.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stories'] }); toast.success('Deleted'); },
  });
  const deleteCharMutation = useMutation({
    mutationFn: (id) => base44.entities.Character.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['characters'] }); toast.success('Deleted'); },
  });
  const deleteArtMutation = useMutation({
    mutationFn: (id) => base44.entities.Art.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['art'] }); toast.success('Deleted'); },
  });

  const getDeleteMutation = () => {
    switch (tab) {
      case 'stories': return deleteStoryMutation;
      case 'characters': return deleteCharMutation;
      case 'art': return deleteArtMutation;
      default: return deleteLetterMutation;
    }
  };

  // Show manager form
  if (editing) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 max-w-3xl mx-auto">
        {tab === 'stories' && <StoryManager story={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}
        {tab === 'characters' && <CharacterManager character={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}
        {tab === 'art' && <ArtManager art={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}
        {tab === 'letters' && <LetterManager letter={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
            <Plus className="w-4 h-4 mr-2" /> New {tab === 'art' ? 'Art' : tab.slice(0, -1)}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setEditing(null); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-heading uppercase tracking-wider border-b-2 transition-colors -mb-[1px] ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content list */}
        {currentLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-20">
            <ScrollText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No {tab} created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentData.map((item) => (
              <Card key={item.id} className="bg-card border-border">
                <CardContent className="flex items-center gap-4 py-4">
                  {/* Thumbnail for letters */}
                  {tab === 'letters' && (
                    <div className="w-14 h-20 rounded-md overflow-hidden border border-border flex-shrink-0 bg-muted">
                      {item.censored_pages?.[0] ? (
                        <img src={item.censored_pages[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ScrollText className="w-5 h-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-semibold truncate">{item.title || item.name}</h3>
                    {tab === 'letters' && (
                      <>
                        <p className="text-xs text-muted-foreground mt-1">
                          Password: <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-[11px]">{item.password}</code>
                          <Badge variant={item.is_published ? 'default' : 'secondary'} className="text-[10px] ml-2">
                            {item.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </p>
                      </>
                    )}
                    {tab === 'stories' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.required_unlock_count} letters needed
                        {item.is_reveal && <Badge className="ml-2 text-[10px] bg-accent/20 text-accent border-accent/30"><Sparkles className="w-3 h-3 mr-1" />Reveal</Badge>}
                      </p>
                    )}
                    {tab === 'characters' && (
                      <p className="text-xs text-muted-foreground mt-1">{item.role_label || 'No role'}</p>
                    )}
                    {tab === 'art' && (
                      <p className="text-xs text-muted-foreground mt-1">{item.character_name || 'No character'}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Delete?')) getDeleteMutation().mutate(item.id);
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