// @ts-nocheck
import {
  defineComponent,
  createApp,
  h,
} from 'vue';

export function mount(Comp) {
  const el = document.createElement('div');
  const app = createApp(Comp);
  const unmount = () => app.unmount(el);
  const comp = app.mount(el);
  comp.unmount = unmount;
  return comp;
}
export function useSetup(setup) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', []);
    },
  });
  return mount(Comp);
}
