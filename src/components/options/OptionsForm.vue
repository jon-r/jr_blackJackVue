<script setup lang="ts">
import { ref } from "vue";

import { DEFAULT_PLAYER } from "~/constants/player.ts";
import { getRandom } from "~/deckTools.ts";
import { useAppStore } from "~/store/store.ts";
import { GameConfig } from "~/types/config.ts";
import { AnyPlayer, Player, PlayerInputStub } from "~/types/players.ts";

import MdIcon from "../common/MdIcon.vue";
import TextButton from "../common/TextButton.vue";
import InputField from "./InputField.vue";

const store = useAppStore();
const emit = defineEmits(["closeModal"]);

function setupPlayerInput(input: Player[]): PlayerInputStub[] {
  return Array.from({ ...input, length: 5 }, (item, index) => ({
    name: item?.name ?? "",
    index,
  }));
}

// const isOptionsModalOpen = ref(true);

const playerInput = ref(setupPlayerInput(store.getters.players));

const deckCount = ref(store.getters.config.deckCount);
const minBet = ref(store.getters.config.minBet);
const autoTime = ref(store.getters.config.autoTime);

const isMoreOptionsOpen = ref(false);

async function newGame() {
  const config: GameConfig = {
    deckCount: deckCount.value,
    minBet: minBet.value,
    autoTime: autoTime.value,
  };

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

  const options = { players, config };

  await store.dispatch("newGame", options);
  emit("closeModal");
}

// todo demo automatically (based on url query). also move this (and many actions) to the state
async function newDemo() {
  await newGame();
  await autoBet(0, playerInput.value.length - 1);
  await store.dispatch("nextPlayerPromise");
  await store.dispatch("nextStage");
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
  <form class="options-form" @submit.prevent="newGame">
    <fieldset class="options-form__group">
      <h4 class="options-form__group-title">Player Names</h4>

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

    <fieldset class="options-form__group">
      <h4
        class="options-form__group-title options-form__group-title--toggleable"
        @click.prevent="isMoreOptionsOpen = !isMoreOptionsOpen"
      >
        In Game Options
        <TextButton icon-only>
          <MdIcon :name="isMoreOptionsOpen ? 'expand_less' : 'expand_more'" />
        </TextButton>
      </h4>
      <template v-if="isMoreOptionsOpen">
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
    </fieldset>

    <footer class="options-form__footer">
      <TextButton @click.prevent="newDemo">New Demo (Skip Bets)</TextButton>
      <TextButton class="options-form__new-game" type="submit"
        >New Game</TextButton
      >
    </footer>
  </form>
</template>

<style>
.options-form {
  &__group {
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--md-sys-color-surface-container-highest);
    padding: var(--gap-sm);

    display: grid;
    grid-gap: var(--gap-sm);
    grid-template-columns: 1fr 1fr;
    margin-bottom: var(--gap-sm);
  }

  &__group-title {
    grid-column: span 2;
    font-size: 0.75rem;
    color: var(--md-sys-color-on-surface-variant);

    &--toggleable {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    color: var(--md-sys-color-primary);
  }

  &__new-game {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);

    &:hover {
      background-color: var(--md-sys-color-on-primary-fixed-variant);
      color: var(--md-sys-color-on-primary);
    }
  }
}
</style>
