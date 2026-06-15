import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function CharacterManager({ character, onDone }) {
  const [name, setName] = useState(character?.name || '');
  const [roleLabel, setRoleLabel] = useState(character?.role_label || '');
  const [description, setDescription] = useState(character?.description || '');
  const [imageUrl, setImageUrl] = useState(character?.image_url || '');
  const [order, setOrder] = useState(character?.order || 0);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name,
        role_label: roleLabel,
        description,
        image_url: imageUrl,
        order: Number(order),
      };
      if (character) {
        await base44.entities.Character.update(character.id, data);
      } else {
        await base44.entities.Character.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      toast.success(character ? 'Character updated' : 'Character created');
      onDone();
    },
    onError: () => toast.error('Failed to save character'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onDone}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-heading text-lg tracking-wider">{character ? 'Edit Character' : 'New Character'}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Saafia Blarod" />
        </div>

        <div>
          <Label htmlFor="role">Role Label</Label>
          <Input id="role" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value)} placeholder="e.g. The Heiress" />
        </div>

        <div>
          <Label htmlFor="desc">Description (Markdown supported)</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Character background..." className="min-h-[150px] font-body" />
        </div>

        <div>
          <Label>Portrait Image</Label>
          <div className="flex items-center gap-3 mt-1">
            <Button variant="outline" disabled={uploading} asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Portrait'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </Button>
          </div>
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="mt-2 max-h-32 rounded border border-border object-contain" />
          )}
        </div>

        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input id="order" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
        </div>
      </div>

      <Button onClick={() => saveMutation.mutate()} disabled={!name || uploading} className="w-full">
        <Save className="w-4 h-4 mr-2" /> {character ? 'Update' : 'Create'} Character
      </Button>
    </div>
  );
}