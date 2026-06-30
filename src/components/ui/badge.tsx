import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-primary/20 text-accent-green border border-accent-green/40",
        secondary:   "bg-secondary text-text-secondary border border-border",
        destructive: "bg-destructive/20 text-error border border-error/40",
        warning:     "bg-warning/20 text-warning border border-warning/40",
        info:        "bg-accent/20 text-accent-cyan border border-accent-cyan/40",
        outline:     "border border-border text-text-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
