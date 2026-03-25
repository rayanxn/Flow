"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/format";
import { parseMentions } from "@/lib/utils/mentions";
import { Send } from "lucide-react";

interface MentionMember {
  user_id: string;
  profile: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

interface MentionInputProps {
  members: MentionMember[];
  onSubmit: (body: string, mentionIds: string[]) => void;
  placeholder?: string;
  initialValue?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function MentionInput({
  members,
  onSubmit,
  placeholder = "Leave a comment...",
  initialValue = "",
  autoFocus = false,
  onCancel,
  submitLabel = "Comment",
}: MentionInputProps) {
  const [body, setBody] = useState(initialValue);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionStartIndex, setMentionStartIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const popoverOpen = mentionQuery !== null;

  const filteredMembers = popoverOpen
    ? members.filter((m) => {
        const q = mentionQuery!.toLowerCase();
        const name = m.profile.full_name?.toLowerCase() ?? "";
        const email = m.profile.email.toLowerCase();
        return name.includes(q) || email.includes(q);
      })
    : [];

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [mentionQuery]);

  const closeMention = useCallback(() => {
    setMentionQuery(null);
    setMentionStartIndex(0);
  }, []);

  const insertMention = useCallback(
    (member: MentionMember) => {
      const name = member.profile.full_name ?? member.profile.email;
      const markup = `@[${name}](${member.user_id}) `;
      const before = body.slice(0, mentionStartIndex);
      const after = body.slice(
        mentionStartIndex + 1 + (mentionQuery?.length ?? 0)
      );
      const newBody = before + markup + after;
      setBody(newBody);
      closeMention();

      // Restore focus and cursor position
      requestAnimationFrame(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.focus();
          const cursorPos = before.length + markup.length;
          ta.setSelectionRange(cursorPos, cursorPos);
        }
      });
    },
    [body, mentionStartIndex, mentionQuery, closeMention]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setBody(value);

      const cursorPos = e.target.selectionStart;

      // Check if we should open/update mention popover
      // Find the last @ before cursor that is preceded by whitespace or start of string
      let atIndex = -1;
      for (let i = cursorPos - 1; i >= 0; i--) {
        if (value[i] === "@") {
          if (i === 0 || /\s/.test(value[i - 1])) {
            atIndex = i;
          }
          break;
        }
        // Stop if we hit whitespace before finding @
        if (/\s/.test(value[i])) break;
      }

      if (atIndex >= 0) {
        const query = value.slice(atIndex + 1, cursorPos);
        // Don't open if query contains a closing paren (already completed mention)
        if (!query.includes(")")) {
          setMentionStartIndex(atIndex);
          setMentionQuery(query);
          return;
        }
      }

      closeMention();
    },
    [closeMention]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (popoverOpen && filteredMembers.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredMembers.length - 1 ? prev + 1 : 0
          );
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredMembers.length - 1
          );
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          insertMention(filteredMembers[selectedIndex]);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          closeMention();
          return;
        }
      }

      // Submit on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey && !popoverOpen) {
        e.preventDefault();
        handleSubmit();
        return;
      }

      // Cancel on Escape when not in mention mode
      if (e.key === "Escape" && !popoverOpen && onCancel) {
        e.preventDefault();
        onCancel();
      }
    },
    [popoverOpen, filteredMembers, selectedIndex, insertMention, closeMention, onCancel]
  );

  const handleSubmit = useCallback(async () => {
    const trimmed = body.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    const mentionIds = parseMentions(trimmed);
    await onSubmit(trimmed, mentionIds);
    setBody("");
    setSubmitting(false);
  }, [body, submitting, onSubmit]);

  return (
    <Popover.Root open={popoverOpen}>
      <Popover.Anchor asChild>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={body}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            autoFocus={autoFocus}
            className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-border-strong transition-colors resize-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!body.trim() || submitting}
            className="absolute right-2 bottom-2 p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title={submitLabel}
          >
            <Send className="size-4" />
          </button>
        </div>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="z-50 w-64 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
        >
          {filteredMembers.length === 0 ? (
            <div className="px-3 py-2 text-xs text-text-muted">
              No members found
            </div>
          ) : (
            <div className="py-1">
              {filteredMembers.map((member, index) => (
                <button
                  key={member.user_id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(member);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm transition-colors ${
                    index === selectedIndex
                      ? "bg-surface-hover"
                      : "hover:bg-surface-hover"
                  }`}
                >
                  <Avatar size="sm">
                    <AvatarImage
                      src={member.profile.avatar_url ?? undefined}
                      alt={member.profile.full_name ?? ""}
                    />
                    <AvatarFallback>
                      {getInitials(
                        member.profile.full_name,
                        member.profile.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-text font-medium truncate text-[13px]">
                      {member.profile.full_name ?? member.profile.email}
                    </div>
                    {member.profile.full_name && (
                      <div className="text-text-muted truncate text-[11px]">
                        {member.profile.email}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
