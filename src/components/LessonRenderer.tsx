import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { getQuizById } from "@/lib/curriculum/load";
import { LessonQuiz } from "./LessonQuiz";

interface LessonRendererProps {
  lessonId: string;
  body: string;
}

const mdxComponents = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 text-xl font-bold text-[var(--text)] first:mt-0" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 text-lg font-semibold text-[var(--text)]" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed text-[var(--text)]" {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-1.5 pl-6 text-[var(--text)]" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-[var(--text)]" {...props} />
  ),
  a: ({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const className =
      "font-medium text-[var(--node-active-side)] underline-offset-2 hover:underline";
    // Internal links go through next/link so they respect basePath.
    if (href.startsWith("/")) {
      return <Link href={href} className={className} {...props} />;
    }
    return <a href={href} className={className} {...props} />;
  },
  code: (props: HTMLAttributes<HTMLElement>) => {
    // Fenced code blocks come through as <pre><code className="language-...">;
    // they get the <pre> override's background, so skip the inline-code chip here.
    const isFencedBlock =
      typeof props.className === "string" && props.className.includes("language-");
    if (isFencedBlock) {
      return <code className="font-mono text-[0.95em]" {...props} />;
    }
    return (
      <code
        className="rounded-md bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--text)]"
        {...props}
      />
    );
  },
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mt-4 overflow-x-auto rounded-xl bg-[var(--terminal-bg)] p-4 font-mono text-sm text-[var(--terminal-text)]"
      {...props}
    />
  ),
};

export async function LessonRenderer({ lessonId, body }: LessonRendererProps) {
  const content = await MDXRemote({
    source: body,
    components: {
      ...mdxComponents,
      Quiz: ({ id }: { id: string }) => <LessonQuiz lessonId={lessonId} quiz={getQuizById(id)} />,
    },
  });

  return <article>{content}</article>;
}
