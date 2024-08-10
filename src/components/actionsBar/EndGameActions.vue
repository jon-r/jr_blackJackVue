<script setup lang="ts">
import {useStore} from "vuex";
import {computed} from "vue";
import {ButtonControl} from "../../types/button.ts";
import {EndGameActionTypes} from "../../constants/gamePlay.ts";
import ButtonBase from "./ButtonBase.vue";


const store = useStore()

const actionButtons = computed<ButtonControl[]>(() => {
  // todo can do this with filter maybe
  const hasPlayers = store.state.activePlayerCount > 0;

  return [
    { id: "end-new", label: EndGameActionTypes.New, canUse: true, icon: "skip_previous", onClick: newGame },
    { id: "end-next", label: EndGameActionTypes.Next, canUse: hasPlayers, icon: "skip_next", onClick: nextRound },
  ];
})

function newGame() {
  const gameEvent = { type: "newGame" };
  return store.dispatch("doEvent", gameEvent);
}

function nextRound() {
  return store.dispatch("nextRound");
}

</script>

<template>
  <section class="ctrl-menu frame flex flex-wrap" >
    <ButtonBase
        v-for="actionButton in actionButtons"
        :key="actionButton.id"
        v-bind="actionButton"

        @click="actionButton.onClick" >
    </ButtonBase>
  </section>
</template>

<style scoped>

</style>
