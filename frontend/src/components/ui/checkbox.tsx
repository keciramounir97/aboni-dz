import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, label, id, checked, ...props }, ref) => {
  const inputId = id || props.name;

  return (
    <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2">
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input type="checkbox" id={inputId} ref={ref} checked={checked} className="peer sr-only" {...props} />
        <span
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded border border-input bg-muted/40 transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
            className,
          )}
        >
          <Check className={cn('h-3 w-3 text-primary-foreground transition-opacity', checked ? 'opacity-100' : 'opacity-0')} />
        </span>
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';
