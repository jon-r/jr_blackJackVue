<script setup lang="ts">
import { ref } from "vue";

import { setupPlayerInput } from "~/helpers/players.ts";
import { useGameActions } from "~/stores/actions/game.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";
import type { GameConfig } from "~/types/config.ts";

import InputField from "./InputField.vue";

const coreStore = useCoreStore();
const playersStore = usePlayersStore();
const gameActions = useGameActions();

const playerInput = ref(setupPlayerInput(playersStore.players));

const deckCount = ref(coreStore.config.deckCount);
const minBet = ref(coreStore.config.minBet);

const isMoreOptionsOpen = ref(false);

function newGame(isDemo = false) {
  const newConfig: GameConfig = {
    deckCount: deckCount.value,
    minBet: minBet.value,
    playerCount: playerInput.value.length,
  };

  gameActions.startGame(playerInput.value, newConfig, isDemo);
}

// todo demo automatically (based on url query)
// fixme - bug with bets if mid game
function newDemo() {
  newGame(true);
}
</script>

<template>
  <form class="options-form" @submit.prevent="() => newGame()">
    <fieldset class="options-form__group">
      <h4 class="options-form__group-title">Player Names</h4>

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

    <fieldset class="options-form__group">
      <h4
        class="options-form__group-title options-form__group-title--toggleable"
        @click.prevent="isMoreOptionsOpen = !isMoreOptionsOpen"
      >
        <span>In Game Options</span>

        <i class="md-icon">{{
          isMoreOptionsOpen ? "expand_less" : "expand_more"
        }}</i>
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
      </template>
    </fieldset>

    <footer class="options-form__footer">
      <button
        type="button"
        class="button-base options-form__footer-button"
        @click.prevent="newDemo"
      >
        New Demo (Skip Bets)
      </button>
      <button
        class="button-base options-form__footer-button options-form__footer-button--filled"
        type="submit"
      >
        New Game
      </button>
    </footer>
  </form>
</template>

<style>
.options-form {
  &__group {
    border: none;
    border-radius: var(--border-radius-md);
    background-color: var(--md-sys-color-surface-container-highest);
    padding: var(--padding-lg);

    display: grid;
    grid-gap: var(--padding-md);
    grid-template-columns: 1fr 1fr;
    margin: 0 0 var(--padding-md);
  }

  &__group-title {
    grid-column: span 2;
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

  &__footer-button {
    height: var(--button-size);
    padding: 0 var(--padding-xl);
    border-radius: var(--border-radius-xl);
    margin-left: var(--padding-lg);

    color: var(--md-sys-color-primary);

    &:hover {
      background-color: var(--md-sys-color-primary-hover-opacity);
    }

    &--filled {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);

      &:hover {
        background-color: var(--md-sys-color-primary-hover);
        color: var(--md-sys-color-on-primary);
        box-shadow: var(--shadow-level-1);
      }
    }
  }
}
</style>
