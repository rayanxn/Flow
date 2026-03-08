"use client";

import { create } from "zustand";

import {
  archiveBoard as archiveBoardAction,
  createBoard as createBoardAction,
  deleteBoard as deleteBoardAction,
  restoreBoard as restoreBoardAction,
  updateBoard as updateBoardAction,
} from "@/actions/boards";
import {
  createCard as createCardAction,
  deleteCard as deleteCardAction,
  moveCard as moveCardAction,
  updateCard as updateCardAction,
} from "@/actions/cards";
import {
  createList as createListAction,
  deleteList as deleteListAction,
  updateListTitle as updateListTitleAction,
} from "@/actions/lists";
import { splitBoards, upsertBoard } from "@/lib/boards";
import { sortByPosition } from "@/lib/fractional-index";
import type {
  Board,
  BoardFormValues,
  BoardWithDetails,
  Card,
  List,
  ListWithCards,
  MoveCardValues,
  UpdateBoardValues,
  UpdateCardValues,
} from "@/types";

interface BoardState {
  boards: Board[];
  archivedBoards: Board[];
  currentBoard: Board | null;
  currentBoardLists: ListWithCards[];
  isLoading: boolean;
  hasHydrated: boolean;
  error: string | null;
  replaceBoardSnapshot: (boards: Board[]) => void;
  createBoard: (input: BoardFormValues) => Promise<Board>;
  updateBoard: (input: UpdateBoardValues) => Promise<Board>;
  archiveBoard: (boardId: string) => Promise<Board>;
  restoreBoard: (boardId: string) => Promise<Board>;
  deleteBoard: (boardId: string) => Promise<void>;
  setCurrentBoard: (board: Board | null) => void;
  setCurrentBoardDetail: (board: BoardWithDetails) => void;
  clearCurrentBoardDetail: () => void;
  addList: (boardId: string, title: string) => Promise<List>;
  updateListTitle: (listId: string, title: string) => Promise<void>;
  removeList: (listId: string) => Promise<void>;
  addCard: (listId: string, title: string) => Promise<Card>;
  updateCard: (input: UpdateCardValues) => Promise<Card>;
  updateCardLocal: (card: Card) => void;
  removeCard: (cardId: string) => Promise<void>;
  removeCardLocal: (cardId: string) => void;
  moveCard: (input: MoveCardValues) => Promise<Card>;
  moveCardLocal: (cardId: string, listId: string, position: string) => void;
  clearError: () => void;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while managing your workspace.";
}

function sortBoardLists(lists: ListWithCards[]) {
  return sortByPosition(lists).map((list) => ({
    ...list,
    cards: sortByPosition(list.cards),
  }));
}

function findCard(lists: ListWithCards[], cardId: string) {
  for (const list of lists) {
    const card = list.cards.find((item) => item.id === cardId);

    if (card) {
      return card;
    }
  }

  return null;
}

function upsertCardInLists(lists: ListWithCards[], card: Card) {
  let hasTargetList = false;
  let hasChanged = false;

  const nextLists = lists.map((list) => {
    const existingCard = list.cards.find((item) => item.id === card.id);
    const remainingCards = list.cards.filter((item) => item.id !== card.id);

    if (existingCard) {
      hasChanged = true;
    }

    if (list.id === card.list_id) {
      hasTargetList = true;
      hasChanged = true;

      return {
        ...list,
        cards: sortByPosition([...remainingCards, card]),
      };
    }

    if (existingCard) {
      return {
        ...list,
        cards: remainingCards,
      };
    }

    return list;
  });

  if (!hasTargetList || !hasChanged) {
    return lists;
  }

  return nextLists;
}

function removeCardFromLists(lists: ListWithCards[], cardId: string) {
  let hasChanged = false;

  const nextLists = lists.map((list) => {
    const nextCards = list.cards.filter((card) => card.id !== cardId);

    if (nextCards.length === list.cards.length) {
      return list;
    }

    hasChanged = true;

    return {
      ...list,
      cards: nextCards,
    };
  });

  if (!hasChanged) {
    return lists;
  }

  return nextLists;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  archivedBoards: [],
  currentBoard: null,
  currentBoardLists: [],
  isLoading: false,
  hasHydrated: false,
  error: null,
  replaceBoardSnapshot(boards) {
    set({
      ...splitBoards(boards),
      currentBoard: get().currentBoard
        ? boards.find((board) => board.id === get().currentBoard?.id) ?? null
        : null,
      isLoading: false,
      hasHydrated: true,
      error: null,
    });
  },
  async createBoard(input) {
    set({ isLoading: true, error: null });

    try {
      const board = await createBoardAction(input);
      const nextBoards = [...get().boards, ...get().archivedBoards];

      set({
        ...splitBoards(upsertBoard(nextBoards, board)),
        hasHydrated: true,
        isLoading: false,
      });

      return board;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },
  async updateBoard(input) {
    set({ isLoading: true, error: null });

    try {
      const board = await updateBoardAction(input);
      const nextBoards = [...get().boards, ...get().archivedBoards];
      const currentBoard = get().currentBoard;

      set({
        ...splitBoards(upsertBoard(nextBoards, board)),
        currentBoard: currentBoard?.id === board.id ? board : currentBoard,
        hasHydrated: true,
        isLoading: false,
      });

      return board;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },
  async archiveBoard(boardId) {
    set({ isLoading: true, error: null });

    try {
      const board = await archiveBoardAction(boardId);
      const nextBoards = [...get().boards, ...get().archivedBoards];
      const currentBoard = get().currentBoard;

      set({
        ...splitBoards(upsertBoard(nextBoards, board)),
        currentBoard: currentBoard?.id === board.id ? board : currentBoard,
        hasHydrated: true,
        isLoading: false,
      });

      return board;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },
  async restoreBoard(boardId) {
    set({ isLoading: true, error: null });

    try {
      const board = await restoreBoardAction(boardId);
      const nextBoards = [...get().boards, ...get().archivedBoards];
      const currentBoard = get().currentBoard;

      set({
        ...splitBoards(upsertBoard(nextBoards, board)),
        currentBoard: currentBoard?.id === board.id ? board : currentBoard,
        hasHydrated: true,
        isLoading: false,
      });

      return board;
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },
  async deleteBoard(boardId) {
    set({ isLoading: true, error: null });

    try {
      await deleteBoardAction(boardId);

      set({
        boards: get().boards.filter((board) => board.id !== boardId),
        archivedBoards: get().archivedBoards.filter((board) => board.id !== boardId),
        currentBoard: get().currentBoard?.id === boardId ? null : get().currentBoard,
        hasHydrated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) });
      throw error;
    }
  },
  setCurrentBoard(board) {
    set({ currentBoard: board });
  },
  setCurrentBoardDetail(board) {
    const { lists, ...boardData } = board;

    set({
      currentBoard: boardData,
      currentBoardLists: sortBoardLists(lists),
    });
  },
  clearCurrentBoardDetail() {
    set({ currentBoard: null, currentBoardLists: [] });
  },
  async addList(boardId, title) {
    try {
      const list = await createListAction(boardId, title);
      const listWithCards: ListWithCards = { ...list, cards: [] };

      set({
        currentBoardLists: sortBoardLists([...get().currentBoardLists, listWithCards]),
      });

      return list;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  async updateListTitle(listId, title) {
    try {
      const updatedList = await updateListTitleAction(listId, title);

      set({
        currentBoardLists: get().currentBoardLists.map((list) =>
          list.id === listId ? { ...list, title: updatedList.title } : list
        ),
      });
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  async removeList(listId) {
    try {
      await deleteListAction(listId);

      set({
        currentBoardLists: get().currentBoardLists.filter((list) => list.id !== listId),
      });
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  async addCard(listId, title) {
    try {
      const card = await createCardAction(listId, title);

      get().updateCardLocal(card);

      return card;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  async updateCard(input) {
    try {
      const updatedCard = await updateCardAction(input);

      get().updateCardLocal(updatedCard);

      return updatedCard;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  updateCardLocal(card) {
    set({
      currentBoardLists: upsertCardInLists(get().currentBoardLists, card),
    });
  },
  async removeCard(cardId) {
    try {
      await deleteCardAction(cardId);

      get().removeCardLocal(cardId);
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  removeCardLocal(cardId) {
    set({
      currentBoardLists: removeCardFromLists(get().currentBoardLists, cardId),
    });
  },
  async moveCard(input) {
    try {
      const movedCard = await moveCardAction(input);

      get().updateCardLocal(movedCard);

      return movedCard;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },
  moveCardLocal(cardId, listId, position) {
    const existingCard = findCard(get().currentBoardLists, cardId);

    if (!existingCard) {
      return;
    }

    get().updateCardLocal({
      ...existingCard,
      list_id: listId,
      position,
    });
  },
  clearError() {
    set({ error: null });
  },
}));
