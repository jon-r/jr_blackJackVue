import Vue from 'vue';
/*
canUse
name
icon
alert
alertIf
*/

Vue.component('button-ctrl', {
  props: ['ctrl'],
  template: `
    <button class="ctrl-btn flex-auto" :disabled="!ctrl.canUse" :class="ctrl.class"  >

      <h5 class="ctrl-btn-title" >{{ctrl.name}}</h5>

      <svg v-if="ctrl.svg" class="token ctrl-btn-icon" viewBox="0 0 100 100" >
        <use :xlink:href="ctrl.svg"/>
      </svg>

      <i v-else-if="ctrl.icon" class="material-icons ctrl-btn-icon" >{{ctrl.icon}}</i>

      <span class="ctrl-btn-alert alert-text" v-if="ctrl.alert" >{{ctrl.alert}}</span>

    </button>
  `,
});
