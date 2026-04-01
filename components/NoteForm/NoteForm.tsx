"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createNote } from "@/lib/api";
import { useNoteDraftStore } from "../../lib/store/noteStore";
import css from "./NoteForm.module.css";
import { CreateNoteValues } from "@/types/note";

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required(),
});

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
    },
  });

  const handleSubmit = (values: CreateNoteValues) => {
    mutation.mutate(values);
  };

  return (
    <Formik
      initialValues={draft}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize>
      {({ values }) => {
        useEffect(() => {
          setDraft(values);
        }, [values, setDraft]);

        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                name="title"
                type="text"
                className={css.input}
              />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" id="tag" name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={() => {
                  clearDraft();
                  router.push("/notes/filter/all");
                }}>
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create note"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
