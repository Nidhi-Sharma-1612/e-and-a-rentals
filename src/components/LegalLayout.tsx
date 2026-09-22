import type { ReactNode } from "react";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="mx-auto max-w-[820px] px-5 pb-20 pt-8 md:px-16 md:pt-12">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted">
            <Link href="/" className="hover:text-terracotta">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink-soft">{title}</span>
          </nav>

          <h1 className="mt-4 font-heading text-3xl font-bold text-ink md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-[13px] text-muted">Last updated: {updated}</p>

          <div className="prose-legal mt-10 flex flex-col gap-6">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-xl font-semibold text-ink">{heading}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </section>
  );
}

// Renders a `**bold**` / `[label](href)` lite-markdown body — just enough to
// let an admin edit these legal sections as plain text while keeping the
// bold leads and links the original hardcoded copy had. A blank line starts
// a new paragraph; a block whose every line starts with "- " becomes a
// bullet list instead.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={match[2]}
          className="font-semibold text-denim hover:text-denim-dark"
        >
          {match[1]}
        </a>,
      );
    } else {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[3]}</strong>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function LegalBody({ body }: { body: string }) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="flex list-disc flex-col gap-1.5 pl-5">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.slice(2), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(block, `${i}`)}</p>;
      })}
    </>
  );
}
