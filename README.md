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
  /**
   * fires when countdown reaches 0
   * (fn: () => void) => void;
   */
  onTimerDone,
  /**
   * fires on every tick with the remaining seconds
   * (fn: (val: number) => void) => void;
   */
  onTimeUpdate,
  /**
   * current countdown value in seconds
   * Ref<number>
   */
  time,
  /**
   * starts the timer
   * () => void
   */
  start,
  /**
   * stops the timer; calls also in `onBeforeUnmount`
   * () => void
   */
  stop,
  /**
   * whether the timer is active
   * Ref<boolean>
   */
  isRunning,
  /**
   * initial countdown duration in seconds (default: 180)
   * Ref<number>
   */
  countdown,
} = useInactiveTimer();
```

Attach event handlers before calling `start()`:
```ts
onTimerDone(() => {
  console.log('user is inactive');
});

onTimeUpdate((remaining) => {
  console.log(`${remaining} seconds remaining`);
});

start();
```

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
Standalone demo app in `demo/`:

```bash
cd demo
npm install
npm run dev
```
