import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function StoryManager({ story, onDone }) {
  const [title, setTitle] = useState(story?.title || '');
  const [content, setContent] = useState(story?.content || '');
  const [requiredUnlockCount, setRequiredUnlockCount] = useState(story?.required_unlock_count || 1);
  const [isReveal, setIsReveal] = useState(story?.is_reveal || false);
  const [order, setOrder] = useState(story?.order || 0);
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        title,
        content,
        required_unlock_count: Number(requiredUnlockCount),
        is_reveal: isReveal,
        order: Number(order),
      };
      if (story) {
        await base44.entities.Story.update(story.id, data);
      } else {
        await base44.entities.Story.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      toast.success(story ? 'Story updated' : 'Story created');
      onDone();
    },
    onError: () => toast.error('Failed to save story'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onDone}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-heading text-lg tracking-wider">{story ? 'Edit Story' : 'New Story'}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The First Sealing" />
        </div>

        <div>
          <Label htmlFor="content">Content (Markdown supported)</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the story content..." className="min-h-[200px] font-body" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="unlocks">Letters Required</Label>
            <Input id="unlocks" type="number" min="1" value={requiredUnlockCount} onChange={(e) => setRequiredUnlockCount(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch checked={isReveal} onCheckedChange={setIsReveal} id="reveal" />
          <Label htmlFor="reveal">This is a Saafia Blarod identity reveal story</Label>
        </div>
      </div>

      <Button onClick={() => saveMutation.mutate()} disabled={!title || !content || saving} className="w-full">
        <Save className="w-4 h-4 mr-2" /> {story ? 'Update' : 'Create'} Story
      </Button>
    </div>
  );
}