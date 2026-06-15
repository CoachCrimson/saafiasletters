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
  const [race, setRace] = useState(character?.race || '');
  const [className, setClassName] = useState(character?.class_name || '');
  const [alignment, setAlignment] = useState(character?.alignment || '');
  const [gender, setGender] = useState(character?.gender || '');
  const [eyes, setEyes] = useState(character?.eyes || '');
  const [height, setHeight] = useState(character?.height || '');
  const [hair, setHair] = useState(character?.hair || '');
  const [skin, setSkin] = useState(character?.skin || '');
  const [age, setAge] = useState(character?.age || '');
  const [weight, setWeight] = useState(character?.weight || '');

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
        race,
        class_name: className,
        alignment,
        gender,
        eyes,
        height,
        hair,
        skin,
        age,
        weight,
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

        <div className="border-t border-border/50 pt-4 mt-4">
          <p className="font-heading text-xs uppercase tracking-[0.15em] text-accent mb-3">Character Stats</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="race">Race</Label>
              <Input id="race" value={race} onChange={(e) => setRace(e.target.value)} placeholder="e.g. Human" />
            </div>
            <div>
              <Label htmlFor="class_name">Class</Label>
              <Input id="class_name" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Wizard" />
            </div>
            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <Input id="alignment" value={alignment} onChange={(e) => setAlignment(e.target.value)} placeholder="e.g. Lawful Good" />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="e.g. Female" />
            </div>
            <div>
              <Label htmlFor="eyes">Eyes</Label>
              <Input id="eyes" value={eyes} onChange={(e) => setEyes(e.target.value)} placeholder="e.g. Amber" />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder='e.g. 5&apos;7"' />
            </div>
            <div>
              <Label htmlFor="hair">Hair</Label>
              <Input id="hair" value={hair} onChange={(e) => setHair(e.target.value)} placeholder="e.g. Jet Black" />
            </div>
            <div>
              <Label htmlFor="skin">Skin</Label>
              <Input id="skin" value={skin} onChange={(e) => setSkin(e.target.value)} placeholder="e.g. Olive" />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 28" />
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 145 lbs" />
            </div>
          </div>
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