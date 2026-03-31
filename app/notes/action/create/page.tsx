"use client";

import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { NoteTag } from "@/types/note";

export default function CreateNote() {
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
      // Handle error, maybe show a toast or something
    }
  };

  const handleCancel = () => {
    router.push("/notes/filter/all");
  };

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </main>
  );
}
