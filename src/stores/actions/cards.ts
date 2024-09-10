import {
  BLACKJACK_SCORE,
  DEALER_STAND_SCORE,
  FACE_SCORE,
  UNKNOWN_CARD,
} from "~/constants/cards.ts";
import { DEALER_ID } from "~/constants/player.ts";
import { getCardScore, isBlankCard } from "~/helpers/cards.ts";
import { useDeckStore } from "~/stores/deckStore.ts";
import { usePlayersStore } from "~/stores/playersStore.ts";
import { PlayingCard } from "~/types/card.ts";

export function useCardsActions() {
  const playersStore = usePlayersStore();
  const deckStore = useDeckStore();

  async function dealCard(
    playerId: number,
    handId?: number,
  ): Promise<PlayingCard | undefined> {
    const newCard = deckStore.drawCard();

    await playersStore.setCard(newCard, playerId, handId);

    return newCard;
  }

  async function dealOrPeekDealerCard(): Promise<PlayingCard | null> {
    const dealerScore = playersStore.dealer.hands[0].score;

    if (dealerScore < FACE_SCORE) {
      return dealBlank(DEALER_ID);
    }

    const newCard = deckStore.drawCard();

    if (getCardScore(newCard) + dealerScore !== BLACKJACK_SCORE) {
      playersStore.setDealerPeekedCard(newCard);
      return dealBlank(DEALER_ID);
    }

    await playersStore.setCard(newCard, DEALER_ID);
    return newCard;
  }

  async function dealBlank(playerId: number, handId?: number): Promise<null> {
    await playersStore.setCard(UNKNOWN_CARD, playerId, handId);
    return null;
  }

  async function dealAllPlayersCards() {
    for (let i = 0; i < playersStore.activePlayers.length; i++) {
      await dealCard(playersStore.activePlayers[i].index);
    }

    // fixme dealer blank card here
    // return dealCard(DEALER_ID, 0, dealerMayPeek);
  }

  async function revealDealerBlanks() {
    if (playersStore.dealer.peekedCard) {
      await playersStore.setCard(playersStore.dealer.peekedCard, DEALER_ID);
    }
    let dealerMayContinue = true;
    while (dealerMayContinue) {
      dealerMayContinue =
        playersStore.dealer.hands[0].score < DEALER_STAND_SCORE;
      if (dealerMayContinue) {
        await dealCard(DEALER_ID);
      }
    }
  }

  async function revealPlayerBlanks(playerId: number, handId?: number) {
    const targetHand = playersStore.getPlayerHand(playerId, handId);

    if (!targetHand) return; // shouldnt happen, maybe throw error?

    const cardsToReveal = targetHand.cards.filter(isBlankCard);

    for (let i = 0; i < cardsToReveal.length; i++) {
      await dealCard(playerId, handId);
    }
  }

  async function revealAllBlankCards() {
    await revealDealerBlanks();

    for (let i = 0; i < playersStore.activePlayers.length; i++) {
      await revealPlayerBlanks(playersStore.activePlayers[i].index);
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
