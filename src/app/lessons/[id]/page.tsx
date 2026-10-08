import { loadLesson } from "@/lib/curriculum/load";
import { LessonRenderer } from "@/components/LessonRenderer";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const { lesson, body } = loadLesson(id);
  const renderedLesson = await LessonRenderer({ lessonId: lesson.id, body });

  return (
    <main>
      <h1>{lesson.title}</h1>
      <p>{lesson.summary}</p>
      {renderedLesson}
    </main>
  );
}
