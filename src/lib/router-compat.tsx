"use client";

import React from "react";
import NextLink from "next/link";
import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams as useNextParams,
} from "next/navigation";

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to?: string;
  href?: string;
  replace?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, replace, ...props }, ref) => {
    const target = to || href || "#";
    return <NextLink ref={ref} href={target} replace={replace} {...props} />;
  }
);
Link.displayName = "CompatLink";

export const NavLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & {
    end?: boolean;
    className?: string | ((props: { isActive: boolean }) => string);
  }
>(({ to, href, className, end, ...props }, ref) => {
  const target = to || href || "#";
  const pathname = usePathname();
  const isActive = end
    ? pathname === target
    : pathname === target || (target !== "/" && pathname.startsWith(target));
  const computedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink
      ref={ref}
      href={target}
      className={computedClassName}
      {...props}
    />
  );
});
NavLink.displayName = "CompatNavLink";

export const useNavigate = () => {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname: pathname || "/",
    search: searchParams?.toString() ? `?${searchParams.toString()}` : "",
    hash: "",
    state: null,
  };
};

export const useParams = () => {
  return useNextParams() || {};
};

export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({
  to,
  replace,
}) => {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
};

export const Outlet: React.FC = () => null;

export default {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
  Outlet,
};

