import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Key, Eye, Feather, Shield, Star, Crown, ScrollText, Sparkles,
  Heart, Flame, Moon, Sun, Gem, Sword, BookOpen, Trophy,
  ChevronDown
} from 'lucide-react';

const COLORS = [
  { key: 'amber', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  { key: 'emerald', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  { key: 'sky', color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
  { key: 'violet', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30' },
  { key: 'rose', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/30' },
  { key: 'primary', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40' },
  { key: 'orange', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  { key: 'indigo', color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30' },
];

const ICON_OPTIONS = [
  { name: 'Key', icon: Key },
  { name: 'Eye', icon: Eye },
  { name: 'Feather', icon: Feather },
  { name: 'Shield', icon: Shield },
  { name: 'Star', icon: Star },
  { name: 'Crown', icon: Crown },
  { name: 'ScrollText', icon: ScrollText },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Heart', icon: Heart },
  { name: 'Flame', icon: Flame },
  { name: 'Moon', icon: Moon },
  { name: 'Sun', icon: Sun },
  { name: 'Gem', icon: Gem },
  { name: 'Sword', icon: Sword },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Trophy', icon: Trophy },
];

export default function MilestoneManager({ milestone, onDone }) {
  const isNew = !milestone;
  const queryClient = useQueryClient();

  const [count, setCount] = useState(milestone?.count || 1);
  const [label, setLabel] = useState(milestone?.label || '');
  const [iconName, setIconName] = useState(milestone?.icon_name || 'Key');
  const [colorKey, setColorKey] = useState(() => {
    if (!milestone?.color) return 'amber';
    const match = COLORS.find(c => c.color === milestone.color);
    return match ? match.key : 'amber';
  });
  const [order, setOrder] = useState(milestone?.order || 0);
  const [iconOpen, setIconOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const colorPreset = COLORS.find(c => c.key === colorKey) || COLORS[0];
      const data = {
        count: Number(count),
        label,
        icon_name: iconName,
        color: colorPreset.color,
        bg: colorPreset.bg,
        border: colorPreset.border,
        order: Number(order),
      };
      if (isNew) {
        await base44.entities.Milestone.create(data);
      } else {
        await base44.entities.Milestone.update(milestone.id, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast.success(isNew ? 'Milestone created' : 'Milestone updated');
      onDone();
    },
    onError: () => toast.error('Failed to save milestone'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    saveMutation.mutate();
  };

  const SelectedIcon = ICON_OPTIONS.find(o => o.name === iconName)?.icon || Key;
  const selectedColor = COLORS.find(c => c.key === colorKey) || COLORS[0];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg tracking-wider">
          {isNew ? 'New Milestone' : 'Edit Milestone'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onDone} className="text-xs">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Count */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Letter Count</Label>
          <Input
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            required
            className="mt-1.5 font-heading"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            How many unsealed letters needed to earn this milestone
          </p>
        </div>

        {/* Label */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Milestone Name</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. First Light, Truthseeker..."
            required
            className="mt-1.5 font-heading"
          />
        </div>

        {/* Icon picker */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Icon</Label>
          <div className="relative mt-1.5">
            <button
              type="button"
              onClick={() => setIconOpen(!iconOpen)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm hover:bg-muted/50 transition-colors"
            >
              <SelectedIcon className="w-4 h-4" />
              <span>{iconName}</span>
              <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
            </button>
            {iconOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-lg shadow-xl z-50 grid grid-cols-4 gap-1 p-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => { setIconName(opt.name); setIconOpen(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs transition-colors ${
                      iconName === opt.name ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="truncate w-full text-center">{opt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Color Theme</Label>
          <div className="relative mt-1.5">
            <button
              type="button"
              onClick={() => setColorOpen(!colorOpen)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm hover:bg-muted/50 transition-colors"
            >
              <div className={`w-5 h-5 rounded-full ${selectedColor.bg} border ${selectedColor.border}`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center ${selectedColor.color}`}>
                  <Star className="w-3 h-3" />
                </div>
              </div>
              <span className="capitalize">{colorKey}</span>
              <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
            </button>
            {colorOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-lg shadow-xl z-50 grid grid-cols-4 gap-1 p-2">
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => { setColorKey(c.key); setColorOpen(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs transition-colors capitalize ${
                      colorKey === c.key ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${c.bg} border ${c.border} flex items-center justify-center ${c.color}`}>
                      <Star className="w-3.5 h-3.5" />
                    </div>
                    {c.key}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order */}
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Display Order</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="mt-1.5"
          />
        </div>

        {/* Preview */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Preview</p>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${selectedColor.bg} ${selectedColor.border}`}>
              <SelectedIcon className={`w-6 h-6 ${selectedColor.color}`} />
            </div>
            <div>
              <p className={`font-heading text-sm tracking-wider ${selectedColor.color}`}>{label || 'Milestone Name'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">After {count} letter{count !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onDone} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/80" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : isNew ? 'Create Milestone' : 'Update Milestone'}
          </Button>
        </div>
      </form>
    </div>
  );
}