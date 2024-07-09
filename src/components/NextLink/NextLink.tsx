import Link from 'next/link';
import { forwardRef } from 'react';

export const NextLink = forwardRef(
  (
    { href, ...others }: React.ComponentPropsWithoutRef<typeof Link>,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) => (
    <Link legacyBehavior href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a {...others} ref={ref} />
    </Link>
  ),
);

NextLink.displayName = 'NextLink';
