import { ref, watch, onBeforeUnmount } from 'vue';
import { createEventHook } from '@vueuse/core';
import * as workerTimersInstance from 'worker-timers';

const addListenerMulti = (
  element: HTMLElement | Window,
  eventNames: string,
  listener: EventListenerOrEventListenerObject,
) => {
  eventNames.split(' ').forEach((e) => {
    element.addEventListener(e, listener, true);
  });
};

const removeListenerMulti = (
  element: HTMLElement | Window,
  eventNames: string,
  listener: EventListenerOrEventListenerObject,
) => {
  eventNames.split(' ').forEach((e) => {
    element.removeEventListener(e, listener, true);
  });
};

const getWorkerInstance = () => {
  if (window.Worker) {
    return workerTimersInstance;
  } else {
    const workerTimers: typeof workerTimersInstance = {
      clearInterval,
      clearTimeout,
      setInterval,
      setTimeout,
    };
    return workerTimers;
  }
};

export const useInactiveTimer = (eventNames: string = 'keydown click scroll') => {
  const workerTimers = getWorkerInstance();

  const isRunning = ref(false);
  const timerDone = createEventHook();
  const timeUpdate = createEventHook();
  const countdown = ref(180);
  const time = ref(countdown.value);

  const resetTime = () => {
    time.value = countdown.value;
  };

  const startListen = () => {
    addListenerMulti(window, eventNames, resetTime);
  };

  const stopListen = () => {
    removeListenerMulti(window, eventNames, resetTime);
  };

  let intervalId: number | undefined;

  const stop = () => {
    isRunning.value = false;
    // keep time=0 visible for one tick before resetting
    workerTimers.setTimeout(() => {
      resetTime();
    }, 100);
    stopListen();
    if (intervalId !== undefined) {
      workerTimers.clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  const updateTime = () => {
    if (time.value > 0) {
      time.value -= 1;
    }
    timeUpdate.trigger(time.value);
  };

  const start = () => {
    stop();
    startListen();
    isRunning.value = true;
    intervalId = workerTimers.setInterval(() => {
      updateTime();
      if (time.value <= 0) {
        stop();
        timerDone.trigger(true);
      }
    }, 1000);
  };

  watch(countdown, () => {
    if (isRunning.value) resetTime();
  });

  onBeforeUnmount(() => {
    stop();
  });

  return {
    onTimerDone: timerDone.on,
    onTimeUpdate: timeUpdate.on,
    time,
    start,
    stop,
    isRunning,
    countdown,
  };
};

export default useInactiveTimer;
