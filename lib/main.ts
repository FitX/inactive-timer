import {
  ref,
  onBeforeUnmount,
} from 'vue';
import {
  createEventHook,
} from '@vueuse/core';
import * as workerTimersInstance from 'worker-timers';

function addListenerMulti(element: HTMLElement | Window, eventNames: string, listener: EventListenerOrEventListenerObject) {
  [].forEach.call(eventNames.split(' '), (e: string) => {
    element.addEventListener(e, listener, true);
  });
}

function removeListenerMulti(element: HTMLElement | Window, eventNames: string, listener: EventListenerOrEventListenerObject) {
  [].forEach.call(eventNames.split(' '), (e: string) => {
    element.removeEventListener(e, listener, true);
  });
}

const getWorkerInstance = () => {
  if (window.Worker) {
    return workerTimersInstance;
  } else {
    /**
     * Fallback for non Browser like Node or Unit Tests
     */
    const workerTimers: typeof workerTimersInstance = {
      clearInterval,
      clearTimeout,
      setInterval,
      setTimeout
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

  function resetTime() {
    time.value = countdown.value;
  }

  function clear() {
    resetTime();
  }

  function startListen() {
    addListenerMulti(window, eventNames, resetTime);
  }

  function stopListen() {
    removeListenerMulti(window, eventNames, resetTime);
  }

  const intervalId = ref<number>();

  function stop() {
    isRunning.value = false;
    // timer end (0) should be visible, so we set timeout
    setTimeout(() => {
      clear();
    }, 100);
    stopListen();
    if (intervalId.value) {
      workerTimers.clearInterval(intervalId.value);
      intervalId.value = undefined;
    }
  }

  function updateTime() {
    if (time.value > 0) {
      time.value -= 1;
    }
    timeUpdate.trigger(time.value);
  }

  function handleDone() {
    timerDone.trigger(true);
  }

  function start() {
    stop();
    startListen();
    isRunning.value = true;
    intervalId.value = workerTimers.setInterval(() => {
      updateTime();
      if (time.value <= 0) {
        stop();
        handleDone();
      }
    }, 1000);
  }

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
