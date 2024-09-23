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

  void gameActions.startGame(playerInput.value, newConfig, isDemo);
}

// todo demo automatically (based on url query)
function newDemo() {
  newGame(true);
}
</script>

<template>
  <form class="options-form" @submit.prevent="() => newGame()">
    <fieldset class="options-form__group">
      <label
        class="options-form__group-title options-form__group-title--toggleable"
        @click.prevent="() => coreStore.toggleDarkMode()"
      >
        <span>Force Light/Dark Mode</span>

        <i class="md-icon">
          {{ coreStore.isDarkMode ? "dark_mode" : "light_mode" }}
        </i>
      </label>
    </fieldset>

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
      <label
        class="options-form__group-title options-form__group-title--toggleable"
        @click.prevent="isMoreOptionsOpen = !isMoreOptionsOpen"
      >
        <span>In-Game Options</span>

        <i class="md-icon">
          {{ isMoreOptionsOpen ? "expand_less" : "expand_more" }}
        </i>
      </label>
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
        class="button-base options-form__footer-button options-form__footer-button--emphasis"
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
      font-size: var(--font-size-body-large);
      font-weight: var(--font-weight-medium);
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

    &--emphasis {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);

      .dark & {
        background: none;
        color: var(--md-sys-color-primary);
        border: solid 1px;
      }

      &:hover {
        background-color: var(--md-sys-color-primary-hover);
        color: var(--md-sys-color-on-primary);
        box-shadow: var(--shadow-level-1);
      }
    }
  }
}
</style>
