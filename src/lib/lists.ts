export const LIST_TITLE_MAX_LENGTH = 120;

export interface ListFormErrors {
  title?: string;
}

export class ListValidationError extends Error {
  fieldErrors: ListFormErrors;

  constructor(fieldErrors: ListFormErrors) {
    const firstError = fieldErrors.title ?? "List details are invalid.";

    super(firstError);
    this.name = "ListValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export function normalizeListTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export function getListTitleError(title: string) {
  const normalizedTitle = normalizeListTitle(title);

  if (!normalizedTitle) {
    return "List title is required.";
  }

  if (normalizedTitle.length > LIST_TITLE_MAX_LENGTH) {
    return `List title must be ${LIST_TITLE_MAX_LENGTH} characters or fewer.`;
  }

  return null;
}

export function parseListTitle(title: string): string {
  const normalizedTitle = normalizeListTitle(title);
  const titleError = getListTitleError(title);

  if (titleError) {
    throw new ListValidationError({ title: titleError });
  }

  return normalizedTitle;
}
