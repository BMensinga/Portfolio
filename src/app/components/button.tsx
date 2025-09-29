import { Children, cloneElement, forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cn } from '~/app/libs/utils';

type ButtonVariant = 'solid' | 'ghost';
type ButtonSize = 'md' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-brand text-white hover:bg-brand/90 active:bg-brand/80 disabled:bg-brand/50 w-fit',
  ghost:
    'bg-transparent text-ink hover:bg-ink/[0.06] active:bg-ink/[0.12] disabled:text-ink-muted font-medium ',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm',
  icon: 'h-8 w-8 p-0',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60 hover:cursor-pointer';

export const buttonVariants = ({
  variant = 'ghost',
  size = 'md',
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} = {}) => cn(baseClasses, variantClasses[variant], sizeClasses[size]);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      type = 'button',
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild) {
      const child = Children.only(children) as ReactElement<any>;

      return cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
