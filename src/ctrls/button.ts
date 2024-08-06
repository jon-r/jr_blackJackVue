import {defineComponent, PropType} from 'vue';
/*
canUse
name
icon
alert
alertIf
*/

export type ButtonControlProps = {
  canUse: boolean;
  name: string;
  icon: string;
  alert?: string;
  class?: string;
  onClick?: () => void;
}

export default defineComponent( {
  props: {
    // todo split this up?
    ctrl: { type: Object as PropType<ButtonControlProps>, required: true },
  },
  template: `
    <button class="ctrl-btn flex-auto" :disabled="!ctrl.canUse" :class="ctrl.class"  >

      <h5 class="ctrl-btn-title" >{{ctrl.name}}</h5>

      <svg v-if="ctrl.svg" viewBox="0 0 100 100" >
          <use class="token ctrl-btn-icon" :xlink:href="ctrl.svg"/>
      </svg>

      <i v-else-if="ctrl.icon" class="material-symbols-outlined ctrl-btn-icon" >{{ctrl.icon}}</i>

      <span class="ctrl-btn-alert alert-text" v-if="ctrl.alert" >{{ctrl.alert}}</span>

    </button>
  `,
});
