import { vi, expect, describe, it } from 'vitest';
import * as workerTimers from 'worker-timers';
import { useInactiveTimer } from './index';
import { useSetup } from './test-utils/mount-helper.ts';

vi.mock('worker-timers', () => ({
  setInterval: vi.fn((cb, ms) => window.setInterval(cb, ms)),
  clearInterval: vi.fn((id) => window.clearInterval(id)),
  setTimeout: vi.fn((cb, ms) => window.setTimeout(cb, ms)),
  clearTimeout: vi.fn((id) => window.clearTimeout(id)),
}));

describe('check timer', () => {
  it('can be start', () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(window, 'setInterval')
    // jest.runAllTimers();
    useSetup(() => {
      const {
        time,
        isRunning,
        start,
        countdown,
      } = useInactiveTimer(); // 600
      expect(time.value).toBe(180);
      expect(isRunning.value).toBe(false);
      countdown.value = 600;
      start();
      expect(isRunning.value).toBe(true);
      vi.advanceTimersToNextTimer()
      expect(time.value).toBe(600);
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      // jest.useRealTimers();
    });
    vi.clearAllTimers();
  });
  it('timer ends', () => {
    vi.useFakeTimers();
    useSetup(() => {
      const { time, start, onTimeUpdate } = useInactiveTimer();
      let timeUpdateCount = null;
      onTimeUpdate((count) => {
        timeUpdateCount = count;
      });
      expect(time.value).toBe(180);
      start();
      vi.advanceTimersByTime(180000);
      expect(time.value).toBe(0);
      expect(timeUpdateCount).toBe(0);
    });
  });
  it('should trigger events', () => {
    vi.useFakeTimers();
    useSetup(() => {
      const { start, onTimeUpdate, onTimerDone } = useInactiveTimer();
      let timeUpdateCount = null;
      let redirectDone = false;
      onTimeUpdate((count) => {
        timeUpdateCount = count;
      });
      start();
      // 2s Tick
      vi.advanceTimersByTime(2000);
      expect(timeUpdateCount).toBe(178);
      vi.advanceTimersByTime(2000);
      expect(timeUpdateCount).toBe(176);
      onTimerDone((done) => {
        redirectDone = done;
      });
      expect(redirectDone).toBe(false);
      // Rest of Tick ahead + 1 Tick for done
      vi.advanceTimersByTime(177000);
      expect(redirectDone).toBe(true);
    });
  });
  it('should be stoppable', () => {
    vi.useFakeTimers();
    useSetup(() => {
      const { start, isRunning, stop } = useInactiveTimer();
      expect(isRunning.value).toBe(false);
      start();
      vi.advanceTimersByTime(1000);
      expect(isRunning.value).toBe(true);
      stop();
      expect(isRunning.value).toBe(false);
    });
  });
  /* it('stops on onBeforeUnmount', async () => {
    const fn = jest.fn(() => {
      console.log('blubb');
    });
    useSetup(() => {
      onBeforeUnmount(fn);
    });
    await nextTick();
    expect(fn).toHaveBeenCalledTimes(1);
  }); */
  it('fires timerDone immediately when countdown is 0', () => {
    vi.useFakeTimers();
    useSetup(() => {
      const { start, countdown, onTimerDone } = useInactiveTimer();
      let done = false;
      countdown.value = 0;
      onTimerDone(() => { done = true; });
      start();
      vi.advanceTimersByTime(1000);
      expect(done).toBe(true);
    });
  });
  it('uses worker-timers when window.Worker is available', () => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'Worker', { value: class {}, configurable: true, writable: true });

    useSetup(() => {
      const { start, stop } = useInactiveTimer();
      start();
      expect(workerTimers.setInterval).toHaveBeenCalled();
      stop();
    });

    Object.defineProperty(window, 'Worker', { value: undefined, configurable: true, writable: true });
    vi.clearAllMocks();
  });
  it('event listener added', async () => {
    const adder = vi
      .spyOn(global, 'addEventListener')
      .mockImplementation(() => {});
    const remover = vi
      .spyOn(global, 'removeEventListener')
      .mockImplementation(() => {});
    const wrapper = useSetup(() => {
      const {
        start,
      } = useInactiveTimer();
      start();
    });
    // this seems to work
    expect(adder).toHaveBeenCalled();
    // causing issues
    wrapper.unmount();
    expect(remover).toHaveBeenCalled();
  });
});
