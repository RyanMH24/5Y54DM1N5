import { MDXRemote } from "next-mdx-remote/rsc";
import { getQuizById } from "@/lib/curriculum/load";
import { LessonQuiz } from "./LessonQuiz";

interface LessonRendererProps {
  lessonId: string;
  body: string;
}

export async function LessonRenderer({ lessonId, body }: LessonRendererProps) {
  const content = await MDXRemote({
    source: body,
    components: {
      Quiz: ({ id }: { id: string }) => <LessonQuiz lessonId={lessonId} quiz={getQuizById(id)} />,
    },
  });

  return <article>{content}</article>;
}
