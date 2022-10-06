import { vi, expect, describe, it } from 'vitest';
import { useInactiveTimer } from './index';
import { useSetup } from './mount-helper';

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
  it('timer ends', async () => {
    vi.useFakeTimers();
    const {
      time,
      start,
      onTimeUpdate,
    } = useInactiveTimer(); // 600
    let timeUpdateCount = null;
    onTimeUpdate((count) => {
      timeUpdateCount = count;
    });
    expect(time.value).toBe(180);
    start();
    vi.advanceTimersByTime(180000);
    expect(time.value).toBe(0);
    expect(timeUpdateCount).toBe(0);
    // jest.useRealTimers();
  });
  it('should trigger events', () => {
    vi.useFakeTimers();
    const {
      start,
      onTimeUpdate,
      onTimerDone,
    } = useInactiveTimer(); // 600
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
  it('should be stoppable', () => {
    vi.useFakeTimers();
    const {
      start,
      isRunning,
      stop,
    } = useInactiveTimer();
    expect(isRunning.value).toBe(false);
    start();
    vi.advanceTimersByTime(1000);
    expect(isRunning.value).toBe(true);
    stop();
    expect(isRunning.value).toBe(false);
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
