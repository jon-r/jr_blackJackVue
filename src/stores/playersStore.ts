import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { DEALER_ID, DEALER_STUB } from "~/constants/player.ts";
import { AUTO_TIME_STANDARD } from "~/constants/settings.ts";
import { updateHand } from "~/helpers/gamePlay.ts";
import {
  createEmptyHand,
  createPlayer,
  isActivePlayer,
} from "~/helpers/players.ts";
import { wait } from "~/helpers/time.ts";
import { PlayingCard } from "~/types/card.ts";
import { Player, PlayerHand, PlayerInputStub } from "~/types/players.ts";

import { useCoreStore } from "./coreStore.ts";

// todo reorganise actions/functions in better folders (after style merge)
export const usePlayersStore = defineStore("players", () => {
  const coreStore = useCoreStore();

  const players = ref<Player[]>([]);

  const dealer = computed(
    () => players.value.find((player) => player.index === DEALER_ID) as Player,
  );

  const activePlayers = computed(() => players.value.filter(isActivePlayer));

  const currentPlayer = computed<Player | undefined>(() =>
    players.value.find((player) => player.index === coreStore.activePlayerId),
  );

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

  function checkPlayersBalance() {
    players.value.forEach((player) => {
      if (player.money < coreStore.config.minBet) {
        player.inGame = false;
      }
    });
  }

  function getNextHand(playerId = coreStore.activePlayerId): boolean {
    const targetPlayer = players.value[playerId];

    if (!targetPlayer) return false;

    const nextHand = targetPlayer.activeHandId + 1;

    if (targetPlayer.hands[nextHand]) {
      targetPlayer.activeHandId = nextHand;
      return true;
    }

    return false;
  }

  function getPlayerHand(
    playerId = coreStore.activePlayerId,
    handId?: number,
  ): PlayerHand | undefined {
    const targetPlayer = players.value[playerId];
    if (!targetPlayer?.inGame) return;

    return targetPlayer.hands[handId ?? targetPlayer.activeHandId];
  }

  function setDealerPeekedCard(card: PlayingCard | null) {
    players.value[DEALER_ID].peekedCard = card;
  }

  async function setCard(card: PlayingCard, playerId: number, handId?: number) {
    await wait(AUTO_TIME_STANDARD);
    const targetPlayer = players.value[playerId];
    const targetHand = getPlayerHand(playerId, handId);

    if (!targetPlayer || !targetHand) return;

    targetPlayer.hands[handId ?? targetPlayer.activeHandId] = updateHand(
      targetHand,
      card,
    );
  }

  return {
    players,
    activePlayers,
    dealer,
    currentPlayer,

    createPlayers,
    getPlayerHand,
    getNextHand,
    resetCards,
    checkPlayersBalance,
    setCard,
    setDealerPeekedCard,
  };
});
