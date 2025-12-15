import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal, untracked } from "@angular/core";
import { HlmButtonImports } from '@libs/ui/button/src';
import { HlmCommandImports } from '@libs/ui/command/src';
import { HlmIconImports } from '@libs/ui/icon/src';
import { HlmPopoverImports } from '@libs/ui/popover/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { PackageDTO } from "@shared/dto/package-dto.interface";
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';

@Component({
  selector: 'package-combobox',
  standalone: true,
  imports: [
    CommonModule,
    BrnCommandImports,
    HlmCommandImports,
    NgIcon,
    HlmIconImports,
    HlmButtonImports,
    BrnPopoverImports,
    HlmPopoverImports,
  ],
  providers: [provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck })],
  template: `
    <brn-popover [state]="_packageComboboxStateSignal()" (stateChanged)="_packageComboboxStateSignal.set($event)" sideOffset="5">
      <button
        class="w-full justify-between font-normal"
        variant="outline"
        brnPopoverTrigger
        (click)="$event.stopPropagation(); _packageComboboxStateSignal.set('open')"
        hlmBtn
      >
        @let selectedPkg = _selectedPackageSignal();
        {{ selectedPkg ? (selectedPkg.name || selectedPkg.id) : 'Select package...' }}
        <ng-icon hlm size="sm" name="lucideChevronsUpDown" class="opacity-50" />
      </button>
      <hlm-command *brnPopoverContent="let ctx" hlmPopoverContent class="w-[300px] p-0">
        <hlm-command-search>
          <ng-icon hlm name="lucideSearch" />
          <input placeholder="Search package..." hlm-command-search-input />
        </hlm-command-search>
        <div *brnCommandEmpty hlmCommandEmpty>No packages found.</div>
        <hlm-command-list>
          <hlm-command-group>
            @for (pkg of packages(); track pkg.id) {
              <button type="button" hlm-command-item [value]="pkg.name || pkg.id" (click)="$event.stopPropagation()" (selected)="_selectPackage(pkg)">
                <span>{{ pkg.name || pkg.id }}</span>
                <ng-icon
                  hlm
                  class="ml-auto"
                  [class.opacity-0]="_selectedPackageSignal()?.id !== pkg.id"
                  name="lucideCheck"
                  hlmCommandIcon
                />
              </button>
            }
          </hlm-command-group>
        </hlm-command-list>
      </hlm-command>
    </brn-popover>
  `
})
export class PackageComboboxComponent {
  public readonly packages = input<PackageDTO[]>([]);
  public readonly selectedPackage = input<PackageDTO | undefined>(undefined);
  public readonly onSelectPackage = output<PackageDTO>();

  protected readonly _packageComboboxStateSignal = signal<'closed' | 'open'>('closed');
  protected readonly _selectedPackageSignal = signal<PackageDTO | undefined>(undefined);

  constructor() {
    effect(() => {
        const pkg = this.selectedPackage();
        untracked(() => {
            this._selectedPackageSignal.set(pkg);
        });
    });
  }

  protected _selectPackage(pkg: PackageDTO) {
    this._selectedPackageSignal.set(pkg);
    this._packageComboboxStateSignal.set('closed');
    this.onSelectPackage.emit(pkg);
  }
}
