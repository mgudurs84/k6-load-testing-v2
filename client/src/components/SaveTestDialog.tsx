import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SaveTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  defaultName?: string;
}

export function SaveTestDialog({ open, onOpenChange, onSave, defaultName = '' }: SaveTestDialogProps) {
  const [name, setName] = useState(defaultName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-save-test">
        <DialogHeader>
          <DialogTitle>Save Test Configuration</DialogTitle>
          <DialogDescription>
            Give your test configuration a name so you can run it again later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="test-name">Test Name</Label>
          <Input
            id="test-name"
            placeholder="e.g., CDR Clinical API Load Test"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            data-testid="input-test-name"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-save">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} data-testid="button-confirm-save">
            Save & Trigger Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
