import Image from "next/image";
import { isRealImage, tileGradient } from "@/lib/images";
import { cn } from "@/lib/utils";

type ThumbProps = {
  src?: string | null;
  alt: string;
  /** Stable string used to pick a gradient for the placeholder tile. */
  seed: string;
  /** Emoji shown on the placeholder tile. Pass null for a plain gradient. */
  icon?: string | null;
  /** Optional caption under the icon on the placeholder. */
  caption?: string | null;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

// Renders a real <Image> when given an uploaded image, otherwise a clean
// branded gradient tile so demo/placeholder data never shows random photos.
export function Thumb({
  src,
  alt,
  seed,
  icon = "🕉️",
  caption,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: ThumbProps) {
  if (isRealImage(src)) {
    return (
      <Image
        src={src as string}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br text-white",
        tileGradient(seed),
        fill ? "absolute inset-0 h-full w-full" : "h-full w-full",
        className
      )}
      style={!fill && width ? { width, height } : undefined}
      aria-label={alt}
      role="img"
    >
      {icon && <span className="text-4xl drop-shadow-sm sm:text-5xl">{icon}</span>}
      {caption && (
        <span className="clamp-2 mt-1 max-w-[90%] px-2 text-center text-xs font-medium text-white/90">
          {caption}
        </span>
      )}
    </div>
  );
}
