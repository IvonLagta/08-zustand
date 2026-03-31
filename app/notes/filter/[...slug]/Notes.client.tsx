"use client";

import { useState } from "react";
import { fetchNotes, deleteNote } from "@/lib/api";
import css from "./NotesPage.module.css";
import NoteList from "@/components/NoteList/NoteList";
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import { NoteTag } from "@/types/note";

type Props = {
  tag: NoteTag | undefined;
};

function NotesClient({ tag }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notes", currentPage, query, tag],
    queryFn: () => fetchNotes(query, currentPage, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleQueryChange = useDebouncedCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, 500);

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={handleQueryChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <Link className={css.button} href={"/notes/action/create"}>
          Create note +
        </Link>
      </header>
      {data?.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default NotesClient;
