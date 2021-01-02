import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface SymbolGroup {
  name: string;
  children: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-new-filter',
  templateUrl: './new-filter.component.html',
  styleUrls: ['./new-filter.component.scss'],
})
export class NewFilterComponent implements OnInit {
  modeControl = new FormControl();
  @Output() modeChange = new EventEmitter<string>();
  @Output() symbolFilter = new BehaviorSubject<string>("");

  isPhotos: boolean = true;

  symbolForm: FormGroup = this._formBuilder.group({
    symbolGroup: '',
    mode: this.modeControl,
  });

  symbolGroups: SymbolGroup[] = [
    {
      name: 'EUR',
      children: [
        'EURAUD',
        'EURCAD',
        'EURCHF',
        'EURCHF',
        'EURGPB',
        'EURJPY',
        'EURNZD',
        'EURUSD',
      ],
    },
    {
      name: 'GBP',
      children: ['GBPAUD', 'GBPCAD', 'GBPJPY', 'GBPNZD', 'GBPUSD', 'GBPCHF'],
    },
    {
      name: 'USD',
      children: ['USDJPY', 'USDCAD', 'USDCHF', 'USDSGD'],
    },
    {
      name: 'AUD',
      children: ['AUDUSD', 'AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD'],
    },
    {
      name: 'NZD',
      children: ['NZDCAD', 'NZDCHF', 'NZDJPY', 'NZDUSD'],
    },
    {
      name: 'CAD',
      children: ['CADCHF', 'CADJPY'],
    },
    {
      name: 'Commodities',
      children: [
        'USDSGD',
        'USDBRO',
        'USDWTI',
        'XAGUSD',
        'XAUUSD',
        'XPDUSD',
        'XPTUSD',
      ],
    },
    {
      name: 'Crypto',
      children: ['BTCUSD', 'DSHUSD', 'ETHUSD', 'LTCUSD'],
    },
  ];

  symbolGroupOptions: Observable<SymbolGroup[]>;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.symbolGroupOptions = this.symbolForm
      .get('symbolGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => {
          this.symbolFilter.next(value);
          return this._filterGroup(value);
        })
      );
  }

  private _filterGroup(value: string): SymbolGroup[] {
    if (value) {
      return this.symbolGroups
        .map((group) => ({
          name: group.name,
          children: _filter(group.children, value),
        }))
        .filter((group) => group.children.length > 0);
    }

    return this.symbolGroups;
  }

  onChangeMode() {
    this.modeChange.emit('photos_emitted');
    this.isPhotos = !this.isPhotos;
  }

  onClick() {
    console.log(this.symbolFilter);
  }

  public options = ['volvo', 'saab', 'mercedes', 'audi'];
}
