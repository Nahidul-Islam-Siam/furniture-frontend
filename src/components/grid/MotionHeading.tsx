import React from 'react';
import { motion } from 'framer-motion';

interface MotionHeadingProps {
  children: React.ReactNode;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
}

/**
 * 99grid (Shopify Motion Theme) Signature Cropper Heading Animation:
 * Wraps text in an overflow-hidden mask and animates the contents up from translateY(115%)
 * with the signature Motion cubic-bezier easing [0.26, 0.54, 0.32, 1].
 */
export const MotionHeading: React.FC<MotionHeadingProps> = ({
  children,
  className = '',
  tag = 'h2',
  delay = 0.1,
}) => {
  const Tag = motion[tag] as any;

  return (
    <div className="overflow-hidden inline-block align-bottom leading-tight">
      <Tag
        initial={{ y: '115%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.85,
          delay,
          ease: [0.26, 0.54, 0.32, 1],
        }}
        className={className}
      >
        {children}
      </Tag>
    </div>
  );
};
