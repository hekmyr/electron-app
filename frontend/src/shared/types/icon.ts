import * as LucideIcons from '@ng-icons/lucide';

export type IconValue = typeof LucideIcons[keyof typeof LucideIcons];

export interface Icon {
  name: string;
  value: IconValue;
  key: string;
}