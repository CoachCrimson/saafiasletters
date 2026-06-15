import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, Save, Image, X } from 'lucide-react';
import { toast } from 'sonner';

export default function LetterManager({ letter, onDone }) {
  const isEdit = !!letter;
  const [form, setForm] = useState({
    title: letter?.title || '',
    letter_number: letter?.letter_number || 1,
    password: letter?.password || '',
    password_hint: letter?.password_hint || '',
    date_in_world: letter?.date_in_world || '',
    is_published: letter?.is_published || false,
    censored_pages: letter?.censored_pages || [],
    uncensored_pages: letter?.uncensored_pages || [],
  });
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        return base44.entities.Letter.update(letter.id, data);
      }
      return base44.entities.Letter.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] });
      toast.success(isEdit ? 'Letter updated' : 'Letter created');
      onDone();
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to save letter');
    },
  });

  const handleUpload = async (type, files) => {
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], ...urls],
    }));
    setUploading(false);
  };

  const removePage = (type, idx) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx),
    }));
  };

  const handleSave = () => {
    if (!form.title) {
      toast.error('Title is required');
      return;
    }
    saveMutation.mutate(form);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-lg">{isEdit ? 'Edit Letter' : 'New Letter'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-heading text-xs uppercase tracking-wider">Title</Label>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Letter I - The Descent" className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-xs uppercase tracking-wider">Order #</Label>
            <Input type="number" value={form.letter_number} onChange={e => setForm(p => ({ ...p, letter_number: Number(e.target.value) }))} className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-xs uppercase tracking-wider">Password (optional — leave blank for freely readable letters)</Label>
            <Input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Leave empty if no lock needed" className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label className="font-heading text-xs uppercase tracking-wider">In-World Date</Label>
            <Input value={form.date_in_world} onChange={e => setForm(p => ({ ...p, date_in_world: e.target.value }))} placeholder="3rd of Ashveil, 1247 AE" className="bg-muted/50" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-heading text-xs uppercase tracking-wider">Password Hint (optional)</Label>
          <Textarea value={form.password_hint} onChange={e => setForm(p => ({ ...p, password_hint: e.target.value }))} placeholder="A cryptic clue..." className="bg-muted/50 h-16" />
        </div>

        <div className="flex items-center gap-3">
          <Switch checked={form.is_published} onCheckedChange={v => setForm(p => ({ ...p, is_published: v }))} />
          <Label className="text-sm">Published (visible to players)</Label>
        </div>

        {/* Censored Pages */}
        <PageUploadSection
          label="Censored Pages"
          pages={form.censored_pages}
          onUpload={(files) => handleUpload('censored_pages', files)}
          onRemove={(idx) => removePage('censored_pages', idx)}
          uploading={uploading}
        />

        {/* Uncensored Pages */}
        <PageUploadSection
          label="Uncensored Pages"
          pages={form.uncensored_pages}
          onUpload={(files) => handleUpload('uncensored_pages', files)}
          onRemove={(idx) => removePage('uncensored_pages', idx)}
          uploading={uploading}
        />

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary hover:bg-primary/80 text-primary-foreground font-heading text-xs uppercase tracking-wider">
            <Save className="w-4 h-4 mr-2" /> {isEdit ? 'Update' : 'Create'}
          </Button>
          <Button variant="outline" onClick={onDone}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PageUploadSection({ label, pages, onUpload, onRemove, uploading }) {
  return (
    <div className="space-y-3">
      <Label className="font-heading text-xs uppercase tracking-wider">{label}</Label>
      <div className="flex flex-wrap gap-3">
        {pages.map((url, i) => (
          <div key={i} className="relative w-20 h-28 rounded-lg overflow-hidden border border-border group">
            <img src={url} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-center py-0.5">
              <span className="text-[10px] text-muted-foreground">P{i + 1}</span>
            </div>
          </div>
        ))}
        <label className="w-20 h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center cursor-pointer transition-colors">
          {uploading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Add</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onUpload(Array.from(e.target.files))}
          />
        </label>
      </div>
    </div>
  );
}