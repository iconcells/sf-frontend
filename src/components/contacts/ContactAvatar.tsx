import type { CSSProperties } from "react";
import { avatarHue, initials } from "@/lib/contacts/format";
import type { Contact } from "@/lib/contacts/types";

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

const PHOTO_DATA_URI_PATTERN = /^data:image\/(png|jpeg|webp);base64,/i;

/** Initials bubble, tinted with a hue derived from the contact's email. */
export default function ContactAvatar({
  contact,
  size = "md",
}: {
  contact: Pick<Contact, "first_name" | "last_name" | "email" | "photo">;
  size?: keyof typeof SIZES;
}) {
  const style = {
    "--avatar-hue": avatarHue(contact.email),
  } as CSSProperties;

  if (contact.photo && PHOTO_DATA_URI_PATTERN.test(contact.photo)) {
    return (
      <img
        src={contact.photo}
        alt=""
        className={`shrink-0 rounded-full object-cover aspect-square ${SIZES[size]}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={style}
      className={`contact-avatar inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-semibold ${SIZES[size]}`}
    >
      {initials(contact)}
    </span>
  );
}
