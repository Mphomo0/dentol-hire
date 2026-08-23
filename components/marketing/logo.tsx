import Image from "next/image";
import Link from "next/link";

export function Logo({
  compact = false,
  size = "default",
}: {
  compact?: boolean;
  size?: "default" | "lg";
}) {
  return (
    <Link
      href="/"
      aria-label="Dantol Hire — home"
      className="group inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
    >
      <Image
        src="/images/logo/logo.webp"
        alt="Dantol Hire"
        width={1788}
        height={576}
        priority
        className={
          compact
            ? "h-11 w-auto sm:h-13"
            : size === "lg"
              ? "h-14 w-auto sm:h-16 md:h-20"
              : "h-12 w-auto sm:h-14 md:h-16"
        }
      />
    </Link>
  );
}
