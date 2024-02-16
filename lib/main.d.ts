export declare const useInactiveTimer: (eventNames?: string) => {
    onTimerDone: import("@vueuse/shared").EventHookOn<any>;
    onTimeUpdate: import("@vueuse/shared").EventHookOn<any>;
    time: import("vue").Ref<number>;
    start: () => void;
    stop: () => void;
    isRunning: import("vue").Ref<boolean>;
    countdown: import("vue").Ref<number>;
};
export default useInactiveTimer;
