import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ITrip } from './modal/trip.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular';
  startPoint = '';
  endPoint = '';
  tripForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tripForm = this.fb.group({
      startPoint: ['', [Validators.required, Validators.minLength(3)]],
      endPoint: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  trips: ITrip[] = [];
 
  // getShortCode(name: string): string {
  //   return name.trim().substring(0, 3).toUpperCase();
  // }

  
  
  get start() {
    return this.tripForm.get('startPoint');
  }

  get end() {
    return this.tripForm.get('endPoint');
  }
  
  

  addTrip(): void {
    if (this.tripForm.invalid) {
      alert('Please enter both points');
      return;
    }
  
    const startPoint = this.tripForm.value.startPoint;
    const endPoint = this.tripForm.value.endPoint;
  
    const trip: ITrip = {
      start: startPoint,
      end: endPoint,
      shortStart: this.getShortCode(startPoint),
      shortEnd: this.getShortCode(endPoint)
    };
  
    this.trips.push(trip);
    this.tripForm.reset();
  }
  
  getShortCode(location: string): string {
    return location.trim().substring(0, 3).toUpperCase();
  }
  isNonContinuedTrip(index: number): boolean {
    if (index === 0) return false;
    return this.trips[index - 1].end !== this.trips[index].start;
  }

  isSameRouteAsPrevious(index: number): boolean {
    if (index === 0) return false;
    const prev = this.trips[index - 1];
    const curr = this.trips[index];
    return prev.start === curr.start && prev.end === curr.end;
  }

  // getLevel(index: number): number {
  //   return this.isSameRouteAsPrevious(index) ? 2 : 1;
  // }
  // Determine the level of the trip
getLevel(index: number): number {
  if (this.isSameRouteAsPrevious(index)) {
    return 2; // Same pickup and drop => Level 2
  }
  return 1; // Otherwise Level 1
}
getArrowType(index: number): 'straight' | 'arrow' {
  return this.isNonContinuedTrip(index) ? 'arrow' : 'straight';
}

}
