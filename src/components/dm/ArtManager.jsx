import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ArtManager({ art, onDone }) {
  const [title, setTitle] = useState(art?.title || '');
  const [imageUrl, setImageUrl] = useState(art?.image_url || '');
  const [characterName, setCharacterName] = useState(art?.character_name || '');
  const [isFeatured, setIsFeatured] = useState(art?.is_featured || false);
  const [order, setOrder] = useState(art?.order || 0);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
      toast.success('Art uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        title,
        image_url: imageUrl,
        character_name: characterName,
        is_featured: isFeatured,
        order: Number(order),
      };
      if (art) {
        await base44.entities.Art.update(art.id, data);
      } else {
        await base44.entities.Art.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['art'] });
      toast.success(art ? 'Art updated' : 'Art created');
      onDone();
    },
    onError: () => toast.error('Failed to save art'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onDone}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-heading text-lg tracking-wider">{art ? 'Edit Art' : 'New Art'}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Saafia in the Garden" />
        </div>

        <div>
          <Label>Art Image</Label>
          <div className="flex items-center gap-3 mt-1">
            <Button variant="outline" disabled={uploading} asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Art'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </Button>
          </div>
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="mt-2 max-h-48 rounded border border-border object-contain" />
          )}
        </div>

        <div>
          <Label htmlFor="charName">Character Name</Label>
          <Input id="charName" value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="e.g. Saafia Blarod" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} id="featured" />
          <Label htmlFor="featured">Featured artwork</Label>
        </div>
      </div>

      <Button onClick={() => saveMutation.mutate()} disabled={!title || !imageUrl || uploading} className="w-full">
        <Save className="w-4 h-4 mr-2" /> {art ? 'Update' : 'Create'} Art
      </Button>
    </div>
  );
}