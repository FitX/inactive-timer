<script setup>
import useInactiveTimer from '@fitx/inactive-timer';
import { ref } from 'vue';

const {
  time,
  start,
  stop,
  isRunning,
  countdown,
  onTimerDone,
  onTimeUpdate,
} = useInactiveTimer();

const updates = ref([]);
const dones = ref([]);

onTimeUpdate(() => {
  updates.value.push(new Date());
});

onTimerDone((id) => {
  console.log('done');
  dones.value.push(id);
});
</script>

<template>
  <header>
    <h1>Demo</h1>
  </header>

  <main>
    <h1>Time {{ time }}</h1>
    <input type="number" v-model.number="countdown">
    <button @click="start()">start timer</button>
    <button v-if="isRunning" @click="stop">Stop</button>
    <h2>dones</h2>
    <pre>{{ dones }}</pre>
    <h2>updates</h2>
    <pre>{{ updates }}</pre>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
