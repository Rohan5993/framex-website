import { useLayoutEffect } from "react";

/**
 * Forces the page to start at scroll position 0 on every load/reload,
 * overriding the browser's native scroll-restoration (which would
 * otherwise jump back to wherever the user was scrolled to before a
 * hard refresh). Runs before useFxInteractions measures pinned-section
 * heights, so those calculations aren't fighting a restored scroll
 * position.
 */
export function useScrollToTopOnLoad() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);
}
