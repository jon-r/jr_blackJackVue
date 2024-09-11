import {
  BLACKJACK_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "~/constants/cards.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { getCardScore, isBlankCard } from "~/helpers/cards.ts";
import { getPlayerHand, playerMustStand } from "~/helpers/playerHands.ts";
import { PlayingCard } from "~/types/card.ts";
import { PlayerHand, PlayerHandIdentifier } from "~/types/players.ts";

import { useDeckStore } from "../deckStore.ts";
import { usePlayersStore } from "../playersStore.ts";

export function useCardsActions() {
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();

  async function dealCard(
    handId: PlayerHandIdentifier,
  ): Promise<PlayingCard | undefined> {
    const newCard = deckStore.drawCard();

    await playersStore.setCard(handId, newCard);

    return newCard;
  }

  async function dealOrPeekDealerCard(): Promise<PlayingCard | null> {
    const dealerScore = (
      getPlayerHand(playersStore.players, DEALER_ID) as PlayerHand
    ).score;

    if (dealerScore < FACE_SCORE) {
      return dealBlank(DEALER_ID);
    }

    const newCard = deckStore.drawCard();

    if (getCardScore(newCard) + dealerScore !== BLACKJACK_SCORE) {
      playersStore.setDealerPeekedCard(newCard);
      return dealBlank(DEALER_ID);
    }

    await playersStore.setCard(DEALER_ID, newCard);
    return newCard;
  }

  async function dealBlank(handId: PlayerHandIdentifier): Promise<null> {
    await playersStore.setCard(handId, UNKNOWN_CARD);
    return null;
  }

  async function dealAllPlayersCards() {
    for (let i = 0; i < playersStore.activePlayers.length; i++) {
      await dealCard(playersStore.activePlayers[i]);
    }
  }

  async function revealDealerBlanks() {
    if (playersStore.dealer.peekedCard) {
      await playersStore.setCard(DEALER_ID, playersStore.dealer.peekedCard);
    }

    while (
      !playerMustStand(
        getPlayerHand(playersStore.players, DEALER_ID) as PlayerHand,
        true,
      )
    ) {
      await dealCard(DEALER_ID);
    }
  }

  async function revealPlayerBlanks(handId: PlayerHandIdentifier) {
    const targetHand = getPlayerHand(playersStore.players, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    const cardsToReveal = targetHand.cards.filter(isBlankCard);

    for (let i = 0; i < cardsToReveal.length; i++) {
      await dealCard(handId);
    }
  }

  async function revealAllBlankCards() {
    await revealDealerBlanks();

    for (let i = 0; i < playersStore.activePlayers.length; i++) {
      await revealPlayerBlanks(playersStore.activePlayers[i]);
    }
  }

  return {
    dealCard,
    dealBlank,

    dealAllPlayersCards,
    dealOrPeekDealerCard,
    revealAllBlankCards,
  };
}
