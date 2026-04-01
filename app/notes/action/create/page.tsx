import type { Metadata } from "next";
import CreateNoteClient from "./CreateNoteClient";
import css from "./CreateNote.module.css";

export const metadata: Metadata = {
  title: "Create Note | Note Hub",
  description:
    "Create a new note in Note Hub. Add title, content and tags to keep your thoughts organized.",
  openGraph: {
    title: "Create Note | Note Hub",
    description:
      "Create a new note in Note Hub. Add title, content and tags to keep your thoughts organized.",
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <CreateNoteClient />
      </div>
    </main>
  );
}
