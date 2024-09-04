<script setup lang="ts">
import { ref } from "vue";

import { GameStages } from "~/constants/gamePlay.ts";
import { setupPlayerInput } from "~/helpers/players.ts";
import { useBetActions } from "~/stores/actions/bets.ts";
import { useGameActions } from "~/stores/actions/game.ts";
import { useCoreStore } from "~/stores/coreStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";
import { GameConfig } from "~/types/config.ts";

import InputField from "./InputField.vue";

const coreStore = useCoreStore();
const playersStore = usePlayersStore();
const gameActions = useGameActions();
const betActions = useBetActions();

const emit = defineEmits(["closeModal"]);

const playerInput = ref(setupPlayerInput(playersStore.players));

const deckCount = ref(coreStore.config.deckCount);
const minBet = ref(coreStore.config.minBet);

const isMoreOptionsOpen = ref(false);

function newGame() {
  const newConfig: GameConfig = {
    deckCount: deckCount.value,
    minBet: minBet.value,
    playerCount: playerInput.value.length,
  };

  gameActions.startGame(playerInput.value, newConfig);

  emit("closeModal");
}

// todo demo automatically (based on url query)
function newDemo() {
  newGame();

  betActions.placeRandomBets();
  coreStore.jumpToStage(GameStages.DealCards);
}
</script>

<template>
  <form class="options-form" @submit.prevent="newGame">
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

  &__footer-button {
    height: 40px;
    padding: 0 var(--gap-md);
    border-radius: var(--border-radius);
    margin-left: var(--gap-sm);

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
        box-shadow: var(--shadow-level1);
      }
    }
  }
}
</style>
