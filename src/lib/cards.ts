export const CARD_TITLE_MAX_LENGTH = 160;

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface CardFormErrors {
  title?: string;
  dueDate?: string;
}

export class CardValidationError extends Error {
  fieldErrors: CardFormErrors;

  constructor(fieldErrors: CardFormErrors) {
    const firstError = fieldErrors.title ?? fieldErrors.dueDate ?? "Card details are invalid.";

    super(firstError);
    this.name = "CardValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export function normalizeCardTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export function getCardTitleError(title: string) {
  const normalizedTitle = normalizeCardTitle(title);

  if (!normalizedTitle) {
    return "Card title is required.";
  }

  if (normalizedTitle.length > CARD_TITLE_MAX_LENGTH) {
    return `Card title must be ${CARD_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  return null;
}

export function parseCardTitle(title: string): string {
  const normalizedTitle = normalizeCardTitle(title);
  const titleError = getCardTitleError(title);

  if (titleError) {
    throw new CardValidationError({ title: titleError });
  }

  return normalizedTitle;
}

export function normalizeCardDescription(description: string | null | undefined) {
  const normalizedDescription = (description ?? "").replace(/\r\n/g, "\n").trim();

  return normalizedDescription || null;
}

export function parseCardDueDate(dueDate: string | null | undefined): string | null {
  const normalizedDueDate = dueDate?.trim() ?? "";

  if (!normalizedDueDate) {
    return null;
  }

  if (DATE_ONLY_PATTERN.test(normalizedDueDate)) {
    return `${normalizedDueDate}T12:00:00.000Z`;
  }

  const parsedDate = new Date(normalizedDueDate);

  if (Number.isNaN(parsedDate.valueOf())) {
    throw new CardValidationError({ dueDate: "Due date is invalid." });
  }

  return parsedDate.toISOString();
}

export function formatCardDueDateInputValue(dueDate: string | null) {
  if (!dueDate) {
    return "";
  }

  return dueDate.slice(0, 10);
}

export function formatCardDueDateLabel(dueDate: string | null) {
  if (!dueDate) {
    return null;
  }

  const parsedDate = new Date(dueDate);

  if (Number.isNaN(parsedDate.valueOf())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
}

export function isCardValidationError(error: unknown): error is CardValidationError {
  return error instanceof CardValidationError;
}
