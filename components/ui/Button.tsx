
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan/50 disabled:opacity-50 disabled:pointer-events-none';

    const variantClasses = {
      default: 'bg-brand-cyan text-brand-bg-dark font-bold hover:shadow-cyan',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-brand-border bg-transparent hover:bg-white/5',
      ghost: 'border border-transparent hover:border-brand-cyan/50 hover:bg-brand-cyan/10 hover:text-brand-cyan',
    };

    const sizeClasses = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10',
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
    ].join(' ');

    return <button className={classes} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button };
