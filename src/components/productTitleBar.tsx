"use client"
import { Button } from '@/components/ui/button';
import React from 'react';

type TitleBarProps = {
  badgeLabel?: string;
  title?: string;
  highlight?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

export default function ProductTitleBar({
  badgeLabel = 'Hot Deals',
  title = 'Products',
  highlight = 'Best Selling',
  buttonLabel,
  onButtonClick,
}: TitleBarProps) {
  return (
    <div className="container m-auto px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-start gap-3">
          <div className="w-2 h-6 bg-secondary rounded-sm mt-1" />
          <div>
            <p className="text-xs text-secondary font-semibold uppercase tracking-wider">
              {badgeLabel}
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              <span className="text-primary">{highlight} </span>
              <span className="text-secondary underline">{title}</span>
            </h2>
          </div>
        </div>

        {/* Right - Button (conditionally rendered) */}
        {buttonLabel && onButtonClick && (
          <Button
            variant="ghost"
            onClick={onButtonClick}
            className="bg-secondary text-white text-xl hover:bg-orange-600 hover:text-white transition"
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
