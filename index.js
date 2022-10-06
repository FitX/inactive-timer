import {
  ref,
  onBeforeUnmount,
} from 'vue';
import {
  createEventHook,
} from '@vueuse/core';
import * as workerTimersInstance from 'worker-timers';

/**
 * Add one or more listeners to an element
 * @param {HTMLElement|Window} element - DOM element to add listeners to
 * @param {string} eventNames - space separated list of event names, e.g. 'click change'
 * @param {Function} listener - function to attach for each event as a listener
 * @Link http://stackoverflow.com/questions/8796988/binding-multiple-events-to-a-listener-without-jquery
 */
function addListenerMulti(element, eventNames, listener) {
  [].forEach.call(eventNames.split(' '), (e) => {
    element.addEventListener(e, listener, true);
  });
}
function removeListenerMulti(element, eventNames, listener) {
  [].forEach.call(eventNames.split(' '), (e) => {
    element.removeEventListener(e, listener, true);
  });
}

export const getWorkerInstance = () => {
  if (window.Worker) {
    return workerTimersInstance;
  } else {
    /**
     * Fallback for non Browser like Node or Unit Tests
     */
    const workerTimers = {};
    workerTimers.clearInterval = clearInterval;
    workerTimers.clearTimeout = clearTimeout;
    workerTimers.setInterval = setInterval;
    workerTimers.setTimeout = setTimeout;
    return workerTimers;
  }
};

/**
 * Inactive Timer
 */
export const useInactiveTimer = (eventNames = 'keydown click scroll') => {
  let workerTimers = getWorkerInstance();
  /**
   * Is Running State
   * @type {Ref<UnwrapRef<boolean>>}
   */
  const isRunning = ref(false);
  /**
   * Event Hook for finished Timer
   * @type {EventHook<any>}
   */
  const timerDone = createEventHook();
  /**
   * Event Hook for Time
   * @type {EventHook<any>}
   */
  const timeUpdate = createEventHook();
  /**
   * Set Time to execute in Seconds
   * @type {Ref<UnwrapRef<number>>}
   */
  const countdown = ref(180);
  /**
   * Get Time to execute in Seconds
   * @type {Ref<UnwrapRef<number>>}
   */
  const time = ref(countdown.value);

  /**
   * Reset Time to default countdown
   */
  function resetTime() {
    time.value = countdown.value;
  }

  /**
   * Clear Timer and Reset Time
   */
  function clear() {
    resetTime();
  }

  /**
   * Start listener for reset Time
   */
  function startListen() {
    addListenerMulti(window, eventNames, resetTime);
  }

  /**
   * Stop listener for reset Time
   */
  function stopListen() {
    removeListenerMulti(window, eventNames, resetTime);
  }

  const intervalId = ref(undefined);

  /**
   * Stop Timer
   */
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

  /**
   * Update Time
   */
  function updateTime() {
    if (time.value > 0) {
      time.value -= 1;
    }
    timeUpdate.trigger(time.value);
  }

  /**
   * Handle Finished Timer
   */
  function handleDone() {
    timerDone.trigger(true);
  }

  /**
   * Start Timer
   */
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
}

export default useInactiveTimer;
