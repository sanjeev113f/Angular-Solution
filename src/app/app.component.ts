import { Component } from '@angular/core';
import { max } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  numSeats: number;
  bookingResult: String;
  seatsList = [];
  name = 'Angular';
  coach = [];
  colors = {
    o: 'Darkgreen', // Free seat
    x: 'Red', // Assigned seat
  };

  constructor() {
    // the coach with 80 seats
    for (let i = 0; i < 11; i++) {
      this.coach.push(['o', 'o', 'o', 'o', 'o', 'o', 'o']);
    }
    this.coach.push(['o', 'o', 'o']);
    // last row with 3 seats
  }
  onSubmit() {
    this.seatsList = [];
    // list to store assign seats in case of non-linear assignment
    var totalFreeSeats = 80;
    var current_seats = this.numSeats;
    // negative input
    if (current_seats <= 0) {
      this.bookingResult = 'Please enter a positive number of seats.';
    }
    // invalid input case
    else if (current_seats > 7) {
      this.bookingResult =
        'Sorry, One person can reserve up to only 7 seats at a time';
    } else {
      let bookedSeats = false;
      for (let i = 0; i < this.coach.length; i++) {
        const row = this.coach[i];
        // if this row has enough seats
        if (
          row.indexOf('o') >= 0 &&
          row.lastIndexOf('o') - row.indexOf('o') + 1 >= current_seats
        ) {
          const startIndex = row.indexOf('o');
          const endIndex = startIndex + current_seats - 1;
          if (row.slice(startIndex, endIndex + 1).indexOf('x') < 0) {
            // it is including Edge Case  when last 2 rows has 3 seats empty so optimal is to place in last row not 2nd last row
            // otherwise later seats will be allocated like 3 in last row and remaining in 2nd last row
            // which is less optimal
            if (
              i == this.coach.length - 2 &&
              current_seats == 3 &&
              this.coach[11].indexOf('o') == 0
            ) {
              this.coach[11].fill('x', 0, 3);
              bookedSeats = true;
              this.bookingResult = `Your seats are: ${i + 2}${1}-${i + 2}${3}`;
              current_seats = 0;
              break;
            } else {
              row.fill('x', startIndex, endIndex + 1);
              bookedSeats = true;
              this.bookingResult = `Your seats are: ${i + 1}${startIndex + 1}-${
                i + 1
              }${endIndex + 1}`;
              current_seats = 0;
              break;
            }
          }
        }
      }
      // if cant assign seats in single row
      // optimal is to start assigning from last row
      //as remaining seats will be in increasing order in rows
      // if seats needed is less than equal to remaining seats
      if (!bookedSeats && totalFreeSeats >= current_seats) {
        var seatsList = [];
        for (let i = this.coach.length - 1; i >= 0; i--) {
          for (
            //index of 1st empty seat
            let j = this.coach[i].indexOf('o');
            j < this.coach[i].length;
            j++
          ) {
            if (current_seats == 0) {
              // if assignment done set flag
              this.bookingResult = ' Seats Are ';
              break;
            }

            if (this.coach[i][j] == 'o') {
              // decerase seats count
              current_seats = current_seats - 1;
              // change state from free to assigned
              this.coach[i][j] = 'x';
              // decerease free seats count
              totalFreeSeats -= 1;
              // add seat-number to list
              this.seatsList.push(`${i + 1}${j + 1}`);
            }
          }
          if (current_seats == 0) {
            // if assignment done set flag
            this.bookingResult = ' Seats Are ';
            // if assignment done
            break;
          }
        }
      }
    }
  }
}
