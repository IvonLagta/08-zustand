"use client";

import NoteForm from "@/components/NoteForm/NoteForm";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { NoteTag } from "@/types/note";

export default function CreateNoteClient() {
  const router = useRouter();

  const handleSubmit = async (values: {
    title: string;
    content: string;
    tag: NoteTag;
  }) => {
    try {
      await createNote(values);
      router.push("/notes/filter/all");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleCancel = () => {
    router.push("/notes/filter/all");
  };

  return <NoteForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}
