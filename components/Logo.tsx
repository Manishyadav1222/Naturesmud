import Link from 'next/link';
import Image from 'next/image';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white';
  className?: string;
  href?: string | null;
  asLink?: boolean;
}

export function Logo({
  size = 'md',
  variant = 'default',
  className = '',
  href = '/',
  asLink = true,
}: LogoProps) {
  // Dimension profiles for clean rendering of the horizontal Naturesmud brandmark
  const dimensions = {
    sm: { width: 140, height: 40, className: 'h-8 sm:h-9 w-auto' },
    md: { width: 190, height: 53, className: 'h-10 sm:h-12 w-auto' },
    lg: { width: 220, height: 62, className: 'h-12 sm:h-14 w-auto' },
    xl: { width: 260, height: 73, className: 'h-14 sm:h-16 w-auto' },
  };

  const current = dimensions[size];
  const logoSrc = variant === 'white' ? '/logo-white.png' : '/logo.png';

  const imageElement = (
    <div className={`relative flex items-center ${!asLink || !href ? className : ''}`}>
      <Image
        src={logoSrc}
        alt="Naturesmud - Pure Food. Real Nature."
        width={current.width}
        height={current.height}
        priority
        className={`${current.className} object-contain drop-shadow-sm`}
      />
    </div>
  );

  // When used inside an existing Link or anchor, avoid rendering nested <a> tag to prevent hydration errors
  if (!asLink || !href) {
    return imageElement;
  }

  return (
    <Link
      href={href}
      className={`relative inline-flex items-center group transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
      aria-label="NaturesMud — Pure Food. Real Nature. Home"
    >
      {imageElement}
    </Link>
  );
}

export default Logo;