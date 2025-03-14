import { ClassValue } from "clsx";

declare module "@/lib/utils" {
  export function cn(...inputs: ClassValue[]): string;
}

declare module "@/components/ui/badge" {
  import { VariantProps } from "class-variance-authority";
  import { HTMLAttributes } from "react";

  const badgeVariants: (props?: {
    variant?: "default" | "secondary" | "destructive" | "outline";
  }) => string;

  interface BadgeProps
    extends HTMLAttributes<HTMLDivElement>,
      VariantProps<typeof badgeVariants> {}

  export const Badge: React.FC<BadgeProps>;
  export { badgeVariants };
}

declare module "@/components/ui/skeleton" {
  import { HTMLAttributes } from "react";

  export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>>;
}
