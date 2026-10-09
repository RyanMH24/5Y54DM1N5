"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { curriculumModules } from "@/content/curriculum/path";
import {
  deriveCurriculumProgress,
  readActivityCompletion,
} from "@/lib/curriculum-sequencing/progress";
import {
  hasSeenCompletionNotice,
  markCompletionNoticeSeen,
} from "@/lib/curriculum-sequencing/completion-notice";
import { StatusIcon } from "@/components/curriculum/StatusIcon";
import { ProgressRing } from "@/components/curriculum/ProgressRing";
import { Sparkle } from "@/components/Sparkle";
import type { CurriculumActivityStatus } from "@/types/curriculum-sequencing";

const statusLabels: Record<CurriculumActivityStatus, string> = {
  completed: "Completed",
  available: "Up next",
  locked: "Locked",
};

const nodeGradient: Record<CurriculumActivityStatus, string> = {
  completed:
    "radial-gradient(circle at 35% 28%, var(--node-done-highlight), var(--node-done-face) 55%, var(--node-done-side) 115%)",
  available:
    "radial-gradient(circle at 35% 28%, var(--node-active-highlight), var(--node-active-face) 55%, var(--node-active-side) 115%)",
  locked: "var(--node-locked-face)",
};

const nodeSideVar: Record<CurriculumActivityStatus, string> = {
  completed: "var(--node-done-side)",
  available: "var(--node-active-side)",
  locked: "var(--node-locked-side)",
};

const nodeIconClasses: Record<CurriculumActivityStatus, string> = {
  completed: "text-[var(--node-done-icon)]",
  available: "text-[var(--node-active-icon)]",
  locked: "text-[var(--node-locked-icon)]",
};

const nodeGlowVar: Record<CurriculumActivityStatus, string> = {
  completed: "var(--node-done-glow)",
  available: "var(--node-active-glow)",
  locked: "var(--node-locked-glow)",
};

// Horizontal offsets (px) that make the path wind left/right as it descends.
const OFFSET_PATTERN = [0, 72, 110, 72, 0, -72, -110, -72];

// One vivid "world" color per module, cycling if there are more modules than colors.
const WORLD_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#f43f5e"];

function subscribeToNothing() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13v3m-3 4h6m-3 0v-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}


export function CurriculumPath() {
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot,
  );
  const progress = deriveCurriculumProgress(
    curriculumModules,
    isHydrated ? readActivityCompletion : () => false,
  );
  const stateById = new Map(progress.activities.map((state) => [state.activity.id, state]));
  const isComplete = progress.completedCount === progress.totalCount;
  const percent = Math.round((progress.completedCount / progress.totalCount) * 100);
  const nextActivityId = progress.activities.find((state) => state.status === "available")
    ?.activity.id;
  const pathIndexById = new Map(
    progress.activities.map((state, index) => [state.activity.id, index]),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [pathD, setPathD] = useState("");
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [completionNoticeDismissed, setCompletionNoticeDismissed] = useState(false);
  const showCompletionNotice =
    isHydrated && isComplete && !completionNoticeDismissed && !hasSeenCompletionNotice();

  function dismissCompletionNotice() {
    markCompletionNoticeSeen();
    setCompletionNoticeDismissed(true);
  }

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      setSvgSize({ width: containerRect.width, height: containerRect.height });
      const points = progress.activities
        .map((state) => nodeRefs.current.get(state.activity.id))
        .filter((el): el is HTMLDivElement => el !== undefined)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top,
          };
        });
      setPathD(buildSmoothPath(points));
    }

    measure();
    // Re-measure one more time after the browser finishes any late layout
    // settling (e.g. web font swap) from the first paint.
    const raf = requestAnimationFrame(measure);

    // ResizeObserver catches any layout shift that resizes the board itself
    // (viewport resize, content changes) — not just window resize.
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
    // Node positions only depend on layout (viewport width), not on progress state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
          <ProgressRing
            value={progress.completedCount}
            max={progress.totalCount}
            size={56}
            strokeWidth={5}
            tone={isComplete ? "success" : "primary"}
          />
          <span className="absolute text-xs font-bold tabular-nums text-[var(--text)]">
            {percent}%
          </span>
        </div>
        <div>
          <p role="status" className="text-sm text-[var(--text-muted)]">
            <span className="text-lg font-bold text-[var(--text)]">
              {progress.completedCount}
            </span>
            /{progress.totalCount} complete
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {isComplete ? "Curriculum complete" : "Your learning path"}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="game-sky relative mt-10 rounded-[2rem] px-2 py-6">
        <svg
          aria-hidden="true"
          className="absolute inset-0 overflow-visible"
          width={svgSize.width}
          height={svgSize.height}
        >
          <path
            d={pathD}
            fill="none"
            stroke="var(--path-line)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <ol className="relative">
          {curriculumModules.flatMap((module, moduleIndex) => {
            const worldColor = WORLD_COLORS[moduleIndex % WORLD_COLORS.length];
            const banner = (
              <li key={`${module.id}-banner`} className="relative z-10 my-6 flex justify-center">
                <div
                  className="rounded-2xl px-5 py-2 text-center shadow-lg"
                  style={{ background: worldColor, boxShadow: `0 8px 20px -6px ${worldColor}` }}
                >
                  <h2 className="text-sm font-extrabold text-white">{module.title}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/80">
                    {module.schedule}
                  </p>
                </div>
              </li>
            );

            const nodeItems = module.activities.map((activity) => {
              const state = stateById.get(activity.id);
              if (!state) {
                throw new Error(`Missing curriculum state for activity: ${activity.id}`);
              }
              const offset =
                OFFSET_PATTERN[(pathIndexById.get(activity.id) ?? 0) % OFFSET_PATTERN.length];
              const isNext = activity.id === nextActivityId;

              return (
                <li key={activity.id} className="relative z-10 flex justify-center py-5">
                  <div
                    style={{ transform: `translateX(${offset}px)` }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      ref={(el) => {
                        if (el) nodeRefs.current.set(activity.id, el);
                        else nodeRefs.current.delete(activity.id);
                      }}
                      style={
                        {
                          "--glow-color": nodeGlowVar[state.status],
                          boxShadow:
                            state.status === "completed"
                              ? `0 0 16px 2px ${nodeGlowVar[state.status]}`
                              : undefined,
                        } as React.CSSProperties
                      }
                      className={`group relative h-16 w-16 rounded-full ${
                        isNext ? "animate-node-bob animate-glow-pulse" : ""
                      }`}
                    >
                      <div
                        aria-hidden="true"
                        className="absolute -bottom-2 left-1/2 h-3 w-11 -translate-x-1/2 rounded-full bg-black/40 blur-[3px]"
                      />
                      {state.status === "completed" && (
                        <Sparkle className="absolute -right-1 -top-1 h-5 w-5" />
                      )}
                      <div
                        className="absolute inset-x-0 bottom-0 top-1.5 rounded-full transition-all duration-100 ease-out group-active:top-0.5"
                        style={{ background: nodeSideVar[state.status] }}
                      />
                      {state.status === "locked" ? (
                        <button
                          type="button"
                          disabled
                          aria-label={activity.title}
                          className="absolute inset-0 flex items-center justify-center rounded-full"
                          style={{ background: nodeGradient[state.status] }}
                        >
                          <StatusIcon
                            status={state.status}
                            bare
                            className={`h-6 w-6 ${nodeIconClasses[state.status]}`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={activity.href}
                          aria-label={activity.title}
                          className={`absolute inset-0 flex items-center justify-center rounded-full transition-transform duration-100 ease-out group-hover:-translate-y-1 group-active:translate-y-1.5 ${
                            isNext ? "ring-4 ring-[var(--node-active-face)]/30" : ""
                          }`}
                          style={{ background: nodeGradient[state.status] }}
                        >
                          <StatusIcon
                            status={state.status}
                            bare
                            className={`h-6 w-6 ${nodeIconClasses[state.status]}`}
                          />
                        </Link>
                      )}
                    </div>
                    <span className="max-w-[96px] text-center text-xs font-medium text-[var(--text)]">
                      {activity.title}
                    </span>
                    <span className="sr-only">{statusLabels[state.status]}</span>
                  </div>
                </li>
              );
            });

            return [banner, ...nodeItems];
          })}

          <li className="relative z-10 mt-4 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div
                style={
                  {
                    boxShadow: isComplete ? "0 0 22px 4px var(--trophy-glow)" : undefined,
                  } as React.CSSProperties
                }
                className={`relative h-20 w-20 rounded-full ${isComplete ? "animate-glow-pulse" : ""}`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 left-1/2 h-3.5 w-14 -translate-x-1/2 rounded-full bg-black/40 blur-[3px]"
                />
                <div
                  className="absolute inset-x-0 bottom-0 top-2 rounded-full"
                  style={{ background: isComplete ? "var(--trophy-side)" : "var(--node-locked-side)" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                  style={{
                    background: isComplete
                      ? "radial-gradient(circle at 35% 28%, var(--trophy-highlight), var(--trophy-face) 55%, var(--trophy-side) 115%)"
                      : "var(--node-locked-face)",
                  }}
                >
                  <TrophyIcon
                    className={`h-9 w-9 ${isComplete ? "text-[#78350f]" : "text-[var(--node-locked-icon)]"}`}
                  />
                </div>
              </div>
              <span className="text-center text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                {isComplete ? "Curriculum complete!" : "The finish line"}
              </span>
            </div>
          </li>
        </ol>
      </div>

      {showCompletionNotice && (
        <div
          role="alertdialog"
          aria-labelledby="completion-notice-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="relative flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-8 py-8 text-center shadow-2xl">
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full animate-glow-pulse"
              style={
                {
                  "--glow-color": "var(--trophy-glow)",
                  background:
                    "radial-gradient(circle at 35% 28%, var(--trophy-highlight), var(--trophy-face) 55%, var(--trophy-side) 115%)",
                } as React.CSSProperties
              }
            >
              <TrophyIcon className="h-10 w-10 text-[#78350f]" />
            </div>
            <h2 id="completion-notice-title" className="text-lg font-extrabold text-[var(--text)]">
              Curriculum complete!
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              You finished every lesson, lab, and console scenario. Nice work.
            </p>
            <button
              type="button"
              onClick={dismissCompletionNotice}
              className="btn-game btn-game-success"
            >
              Nice!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
