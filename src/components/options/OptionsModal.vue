<script setup lang="ts">
// import { storeToRefs } from "pinia";
import { ref } from "vue";

import { GameStages } from "../../constants/gamePlay.ts";
// import { DEFAULT_PLAYER_NAMES } from "../../constants/player.ts";
import { setupPlayerInput } from "../../helpers/players.ts";
// import { DEFAULT_PLAYER } from "../../constants/player.ts";
// import { useAppStore } from "../../store/store.ts";
import { useBetActions } from "../../stores/actions/bets.ts";
import { useGameActions } from "../../stores/actions/game.ts";
import { useCoreStore } from "../../stores/coreStore.ts";
import { usePlayersStore } from "../../stores/playersStore.ts";
import { GameConfig } from "../../types/config.ts";
// import { Player, PlayerInputStub } from "../../types/players.ts";
import TextButton from "../common/TextButton.vue";
import InputField from "./InputField.vue";
import ModalContainer from "./ModalContainer.vue";

// const { dispatch } = useAppStore();
const coreStore = useCoreStore();
const playersStore = usePlayersStore();
const gameActions = useGameActions();
const betActions = useBetActions();

const emit = defineEmits(["closeModal"]);

const playerInput = ref(setupPlayerInput(playersStore.players));

const deckCount = ref(coreStore.config.deckCount);
const minBet = ref(coreStore.config.minBet);
const autoTime = ref(coreStore.config.autoTime);

const isMoreOptionsOpen = ref(false);

// todo move new player functionality to the state
function newGame() {
  const newConfig: GameConfig = {
    deckCount: deckCount.value,
    minBet: minBet.value,
    autoTime: autoTime.value,
    playerCount: playerInput.value.length,
  };

  gameActions.newGame(playerInput.value, newConfig);
  /*
  const players: AnyPlayer[] = playerInput.value.map((player) => ({
    ...DEFAULT_PLAYER,
    ...player,
  }));

  players.push({
    ...DEFAULT_PLAYER,
    name: "Dealer",
    index: players.length,
    isDealer: true,
  });

  const options = { players, config: newConfig };

  await store.dispatch("newGame", options);
*/

  emit("closeModal");
}

// todo demo automatically (based on url query)
function newDemo() {
  newGame();

  betActions.placeRandomBets();
  coreStore.jumpToStage(GameStages.DealCards);
  // autoBet();
  // await store.dispatch("nextPlayerPromise");
  // await store.dispatch("nextStage");
}

// function autoBet() {
//   // if (idx > max) return Promise.resolve();
//
//   // const betVals = {
//   //   idx,
//   //   value: rngBet,
//   // };
//   // const betEvent = {
//   //   idx,
//   //   type: "bet",
//   //   value: "addBet",
//   // };
//   // const nextIdx = idx + 1;
//   //
//   // await dispatch("playerSetBet", betVals);
//   // await dispatch("doEvent", betEvent);
//   // await autoBet(nextIdx, max);
// }
</script>
<template>
  <ModalContainer
    title="Let's Play BlackJack!"
    @close-modal="() => $emit('closeModal')"
  >
    <form class="options-form frame" @submit.prevent="newGame">
      <fieldset class="options-group">
        <h4 class="options-title frame">Player Names</h4>

        <!-- todo add/remove players -->
        <InputField
          v-for="(player, i) in playerInput"
          :key="i"
          v-model="player.name"
          type="text"
          :input-id="'p-' + i"
          :label="'Player ' + (i + 1)"
          icon="person"
        />
      </fieldset>

      <fieldset class="options-group">
        <template v-if="isMoreOptionsOpen">
          <h4 class="options-title">
            <TextButton @click.prevent="isMoreOptionsOpen = false">
              Less Options

              <MdIcon name="expand_less" />
            </TextButton>
          </h4>

          <InputField
            v-model.number="deckCount"
            input-id="deck"
            icon="style"
            label="Decks"
            type="number"
          />
          <InputField
            v-model.number="minBet"
            input-id="bet"
            icon="remove_circle"
            label="Minimum Bet"
            type="number"
          />
          <InputField
            v-model.number="autoTime"
            input-id="time"
            icon="slow_motion_video"
            label="Deal Speed"
            type="number"
          />
        </template>
        <template v-else>
          <h4 class="options-title">
            <TextButton @click.prevent="isMoreOptionsOpen = true">
              More Options

              <MdIcon name="expand_more" />
            </TextButton>
          </h4>
        </template>
      </fieldset>

      <div class="modal-footer frame-thick text-right">
        <TextButton type="submit">NEW GAME</TextButton>
        <TextButton @click.prevent="newDemo">SKIP BETS (DEMO)</TextButton>
      </div>
    </form>
  </ModalContainer>
</template>
