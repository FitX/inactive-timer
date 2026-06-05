<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, RouterView, RouterLink } from 'vue-router';
import useInactiveTimer from '@fitx/inactive-timer';
// import useInactiveTimer from '@fitx/inactive-timer-legacy'; // useInactiveTimerLegacy

const route = useRoute();
const { time, start, isRunning, countdown, onTimerDone } = useInactiveTimer();

const dialogRef = ref<HTMLDialogElement | null>(null);
const loggedOut = ref(false);

onTimerDone(() => {
  loggedOut.value = true;
});

watch(loggedOut, (val) => {
  if (val) {
    dialogRef.value?.showModal();
  } else {
    dialogRef.value?.close();
  }
});

watch(
  () => route.meta.logoutTimeout,
  (timeout) => {
    if (!timeout) return;
    countdown.value = timeout;
    if (!isRunning.value) {
      start();
    }
  },
  { immediate: true },
);

const login = () => {
  loggedOut.value = false;
  start();
};
</script>

<template>
  <div class="layout">
    <nav class="nav" aria-label="Main navigation">
      <span class="nav__title">Demo App</span>
      <RouterLink class="nav__link" to="/dashboard">Dashboard</RouterLink>
      <RouterLink class="nav__link" to="/profile">Profile</RouterLink>
      <RouterLink class="nav__link" to="/payment">Payments</RouterLink>
    </nav>

    <div
      class="timer-bar"
      :class="{ 'timer-bar--warning': time <= 5 && isRunning }"
      role="status"
      :aria-label="`Inactivity timer: ${time} of ${countdown} seconds remaining`"
    >
      <span class="timer-bar__label" aria-hidden="true">Inactivity timer:</span>
      <span class="timer-bar__value" aria-hidden="true">{{ time }}s</span>
      <span class="timer-bar__meta" aria-hidden="true">/ {{ countdown }}s ({{ route.meta.title }})</span>
      <span class="timer-bar__status" :class="{ 'timer-bar__status--running': isRunning }" aria-hidden="true">
        {{ isRunning ? '● running' : '○ stopped' }}
      </span>
    </div>

    <main class="main">
      <RouterView />
    </main>

    <dialog
      ref="dialogRef"
      class="overlay"
      aria-labelledby="overlay-title"
      @cancel.prevent="login"
    >
      <h2 id="overlay-title" class="overlay__title">Session expired Demo 🐨</h2>
      <p class="overlay__text">You were logged out due to inactivity.</p>
      <button class="overlay__button" autofocus @click="login">Log in again</button>
    </dialog>
  </div>
</template>

<style scoped>
.layout {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-black);
  color: var(--color-white);
}

.nav__title {
  font-weight: 700;
  margin-right: auto;
}

.nav__link {
  color: var(--color-gray);
  text-decoration: none;
  font-size: var(--font-size-md);
}

.timer-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1.5rem;
  background: light-dark(#f0f0f0, #1c1c1c);
  border-bottom: 1px solid light-dark(#ddd, #333);
  font-size: var(--font-size-sm);
  transition: background 0.3s;
}

.timer-bar--warning {
  background: light-dark(#fff0e0, #2a1500);
  border-color: var(--color-primary);
}

.timer-bar__label {
  color: var(--color-gray);
}

.timer-bar__value {
  font-weight: 700;
  font-size: var(--font-size-base);
  min-width: 3ch;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
}

.timer-bar__meta {
  color: var(--color-gray);
}

.timer-bar__status {
  margin-left: auto;
  font-size: var(--font-size-xs);
  color: var(--color-gray);
}

.timer-bar__status--running {
  color: var(--color-success);
}

.main {
  flex: 1;
  padding: 2rem 1.5rem;
}

.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  border: none;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  text-align: center;
  max-width: 360px;
  width: 90%;
  background: light-dark(var(--color-white), #1c1c1c);
  color: light-dark(var(--color-black), var(--color-white));
}

.overlay::backdrop {
  background: rgba(0, 0, 0, 0.55);
}

.overlay[open] {
  animation: overlay-in 0.2s ease-out;
}

@keyframes overlay-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.overlay__title {
  margin: 0 0 0.5rem;
}

.overlay__text {
  color: var(--color-gray);
  margin-bottom: 1.5rem;
}

.overlay__button {
  padding: 0.6rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: var(--font-size-base);
}
</style>

<style>
:root {
  --color-black: #111;
  --color-white: #fff;
  --color-gray: #888;
  --color-success: #27ae60;
  --color-primary: #ed6a12;

  --font-size-xs: 0.8rem;
  --font-size-sm: 0.85rem;
  --font-size-md: 0.9rem;
  --font-size-base: 1rem;
}

.nav__link.router-link-active {
  color: var(--color-white);
  font-weight: 600;
}
</style>
