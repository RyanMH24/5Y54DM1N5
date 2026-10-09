import { getAllLessonIds, loadLesson } from "@/lib/curriculum/load";
import { LessonRenderer } from "@/components/LessonRenderer";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllLessonIds().map((id) => ({ id }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const { lesson, body } = loadLesson(id);
  const renderedLesson = await LessonRenderer({ lessonId: lesson.id, body });

  return (
    <main className="game-sky min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-glow animate-text-flicker text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">{lesson.summary}</p>
        {renderedLesson}
      </div>
    </main>
  );
}
