import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { DEALER_ID, DEALER_STUB } from "~/constants/player.ts";
import { AUTO_TIME_SHORT, AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import {
  addToHand,
  createEmptyHand,
  divideHand,
  getPlayerHand,
} from "~/helpers/playerHands.ts";
import { createPlayer, isActivePlayer } from "~/helpers/players.ts";
import { wait } from "~/helpers/time.ts";
import type { PlayingCard } from "~/types/card.ts";
import type {
  Player,
  PlayerHandIdentifier,
  PlayerIdentifier,
  PlayerInputStub,
} from "~/types/players.ts";

export const usePlayersStore = defineStore("players", () => {
  const players = ref<Player[]>([]);

  const dealer = computed(
    () =>
      players.value.find(
        (player) => player.index === DEALER_ID.index,
      ) as Player,
  );

  const activePlayers = computed(() => players.value.filter(isActivePlayer));

  function createPlayers(stubs: PlayerInputStub[]) {
    players.value = [DEALER_STUB, ...stubs].map(createPlayer);
  }

  function resetCards() {
    players.value.forEach((player) => {
      player.hands = [createEmptyHand()];
      player.outcome = null;
      player.activeHandId = 0;
      player.peekedCard = null;
    });
  }

  function removePlayer({ index }: PlayerIdentifier) {
    players.value[index].inGame = false;
  }

  function getNextHand({ index }: PlayerIdentifier): boolean {
    const targetPlayer = players.value[index];

    const nextHand = targetPlayer.activeHandId + 1;

    if (targetPlayer.hands[nextHand]) {
      targetPlayer.activeHandId = nextHand;
      return true;
    }

    return false;
  }

  function setDealerPeekedCard(card: PlayingCard | null) {
    players.value[DEALER_ID.index].peekedCard = card;
  }

  async function setCard(handId: PlayerHandIdentifier, card: PlayingCard) {
    await wait(AUTO_TIME_STANDARD);
    const targetPlayer = players.value[handId.index];
    const targetHand = getPlayerHand(players.value, handId);

    if (!targetHand) return;

    targetPlayer.hands[handId.activeHandId] = addToHand(targetHand, card);
  }

  async function splitHand({ index }: PlayerIdentifier) {
    await wait(AUTO_TIME_SHORT);
    const targetPlayer = players.value[index];

    const originalHand = targetPlayer.hands.at(-1);

    if (!originalHand) return;

    targetPlayer.hands = divideHand(originalHand);
  }

  return {
    players,
    activePlayers,
    dealer,

    splitHand,
    createPlayers,
    getNextHand,
    resetCards,
    removePlayer,
    setCard,
    setDealerPeekedCard,
  };
});
