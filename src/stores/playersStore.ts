import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { DEALER_ID, DEALER_STUB } from "~/constants/player.ts";
import { AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import { createEmptyHand, updateHand } from "~/helpers/playerHands.ts";
import { createPlayer, isActivePlayer } from "~/helpers/players.ts";
import { wait } from "~/helpers/time.ts";
import { PlayingCard } from "~/types/card.ts";
import {
  Player,
  PlayerHand,
  PlayerHandIdentifier,
  PlayerIdentifier,
  PlayerInputStub,
} from "~/types/players.ts";

// todo reorganise actions/functions in better folders (after style merge)
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

  function getPlayerHand(
    playerId: PlayerHandIdentifier,
  ): Readonly<PlayerHand | undefined> {
    return players.value[playerId.index].hands[playerId.activeHandId];
  }

  function setDealerPeekedCard(card: PlayingCard | null) {
    players.value[DEALER_ID.index].peekedCard = card;
  }

  // todo pass along an identifier, and put it as the first param everywhere. try to remove optionals?
  async function setCard(playerId: PlayerHandIdentifier, card: PlayingCard) {
    await wait(AUTO_TIME_STANDARD);
    const targetPlayer = players.value[playerId.index];
    const targetHand = getPlayerHand(playerId);

    if (!targetPlayer || !targetHand) return;

    targetPlayer.hands[playerId.activeHandId] = updateHand(targetHand, card);
  }

  return {
    players,
    activePlayers,
    dealer,

    createPlayers,
    getPlayerHand,
    getNextHand,
    resetCards,
    removePlayer,
    setCard,
    setDealerPeekedCard,
  };
});
