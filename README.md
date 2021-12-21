# inactive-timer
Inactive Timer function with web worker Support.
Starts a Timer and Reset them on User Interaction.

## Installation
```
npm i @fitx/inactive-timer
```

## Usage
```
import useInactiveTimer from '@fitx/inactive-timer';

const {
  onTimerDone, // Event if Timer Ends
  onTimeUpdate, // Event if time value is updated
  time, // current countdown time in seconds
  start, // function to start timer
  stop, // function to stop timer
  isRunning, // state if timer is running
  countdown, // inital countdown time in seconds
} = useInactiveTimer();
```
