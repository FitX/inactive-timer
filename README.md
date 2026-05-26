# inactive-timer

Inactive Timer composable with Web [Worker](https://github.com/chrisguttandin/worker-timers) support. 
Starts a countdown and resets it on user interaction. EventHooks via [VueUse](https://github.com/vueuse/vueuse)

## Installation

```bash
npm i @fitx/inactive-timer
```

## Usage

```ts
import useInactiveTimer from '@fitx/inactive-timer';

const {
  onTimerDone,  // (fn: () => void) => void; fires when countdown reaches 0
  onTimeUpdate, // (fn: (val: number) => void) => void; fires on every tick with the remaining seconds
  time,         // Ref<number>        current countdown value in seconds
  start,        // () => void         start the timer
  stop,         // () => void         stop the timer
  isRunning,    // Ref<boolean>       whether the timer is active
  countdown,    // Ref<number>        initial countdown duration in seconds (default: 180)
} = useInactiveTimer();
```

Attach event handlers before calling `start()`:

```ts
onTimerDone(() => {
  console.log('User is inactive');
});

onTimeUpdate((remaining) => {
  console.log(remaining);
});

start();
```

The composable must be called inside a Vue component setup context. It calls `stop()` automatically in `onBeforeUnmount`.

## Development

```bash
npm run dev           # Start Vite dev server
npm run build         # TypeScript compile + library build + generate .d.ts
npm run lint          # ESLint (lib/)
npm run format        # Prettier (lib/)
npm run test          # Run tests in watch mode (Vitest)
npm run test:coverage # Run tests once with v8 coverage report
```

## Demo

A standalone Vue 3 demo app lives in `demo/`:

```bash
cd demo
npm install
npm run dev
```