<script setup lang="ts">
import { ref } from "vue";

import { DEFAULT_PLAYER } from "../../constants/player.ts";
import { getRandom } from "../../deckTools.ts";
import { useAppStore } from "../../store/store.ts";
import { GameConfig } from "../../types/config.ts";
import { AnyPlayer, Player, PlayerInputStub } from "../../types/players.ts";
import TextButton from "../common/TextButton.vue";
import InputField from "./InputField.vue";
import ModalContainer from "./ModalContainer.vue";
import {GamePlayState, useGamePlayStore} from "../../stores/gamePlayStore.ts";
import {storeToRefs} from "pinia";

const store = useAppStore();
const gamePlayStore = useGamePlayStore()
const {config: {deckCount, minBet, autoTime}}: GamePlayState = storeToRefs(gamePlayStore)
const emit = defineEmits(["closeModal"]);

function setupPlayerInput(input: Player[]): PlayerInputStub[] {
  return Array.from({ ...input, length: 5 }, (item, index) => ({
    name: item?.name ?? "",
    index,
  }));
}

const playerInput = ref(setupPlayerInput(store.getters.players));

// const deckCount = ref(store.getters.config.deckCount);
// const minBet = ref(store.getters.config.minBet);
// const autoTime = ref(store.getters.config.autoTime);

const isMoreOptionsOpen = ref(false);

// todo move new player functionality to the state
async function newGame() {
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

  const newConfig: GameConfig = {
    deckCount: deckCount,
    minBet: minBet,
    autoTime: autoTime,
    playerCount: players.length // todo maybe -1 to count without dealer
  };

  const options = { players, config: newConfig };

  await store.dispatch("newGame", options);
  gamePlayStore.setConfig(newConfig)

  emit("closeModal");
}

// todo demo automatically (based on url query). also move this (and many actions) to the state
async function newDemo() {
  await newGame();
  await autoBet(0, playerInput.value.length - 1);
  // await store.dispatch("nextPlayerPromise");
  gamePlayStore.nextPlayer()
  gamePlayStore.nextStage()
  // await store.dispatch("nextStage");
}

async function autoBet(idx: number, max: number) {
  if (idx > max) return Promise.resolve();

  const rngBet = (getRandom(10) + 1) * 100;

  const betVals = {
    idx,
    value: rngBet,
  };
  const betEvent = {
    idx,
    type: "bet",
    value: "addBet",
  };
  const nextIdx = idx + 1;

  await store.dispatch("playerSetBet", betVals);
  await store.dispatch("doEvent", betEvent);
  await autoBet(nextIdx, max);
}
</script>
<template>
  <ModalContainer
    title="Let's Play BlackJack!"
    @close-modal="() => $emit('closeModal')"
  >
    <form class="options-form frame" @submit.prevent="newGame">
      <fieldset class="options-group">
        <h4 class="options-title frame">Player Names</h4>

        <InputField
          v-for="(player, i) in playerInput"
          :key="player.index"
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
