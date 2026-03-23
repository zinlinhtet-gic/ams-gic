import { hasSubDomain } from "../config";

const getHostname = (): string => {
  return window.location.hostname;
};

const getPathname = (): string => {
  return window.location.pathname;
};

const getSubdomain = (): string | null => {
  if (!hasSubDomain) {
    return getPathPrefix(); // dev mode → no subdomain
  }

  const parts = getHostname().split(".");

  if (parts.length < 3) {
    return null;
  }

  return parts[0];
};

const isAdminSubdomain = (): boolean => {
  // ✅ Production: subdomain-based
  if (hasSubDomain) {
    return getSubdomain() === "admin";
  }

  // ✅ Dev: path-based
  return getPathname().startsWith("/admin");
};

const isTenantSubdomain = (): boolean => {
  // ✅ Production
  if (hasSubDomain) {
    const subdomain = getSubdomain();
    return !!subdomain && subdomain !== "admin";
  }

  // ✅ Dev fallback → everything not /admin is tenant
  return !getPathname().startsWith("/admin");
};

const getPathPrefix = (): string | null => {
  const path = window.location.pathname;

  // remove leading/trailing slashes and split
  const segments = path.replace(/^\/+|\/+$/g, "").split("/");

  if (segments.length === 0 || segments[0] === "") {
    return null;
  }
  console.log("getPathPrefix - segments:", segments);
  return segments[0];
}

export {
  getHostname,
  getSubdomain,
  isAdminSubdomain,
  isTenantSubdomain,
};