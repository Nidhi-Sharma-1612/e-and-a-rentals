export function sectionIdFromHref(href: string): string {
  const hashIndex = href.indexOf("#");
  return hashIndex === -1 ? "" : href.slice(hashIndex + 1);
}
