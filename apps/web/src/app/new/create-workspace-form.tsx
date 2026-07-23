"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@cykani/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@cykani/ui/field";
import { Input } from "@cykani/ui/input";
import { toast } from "sonner";

import { validateSlug, slugify } from "@cykani/lib/validators/slug";

export function CreateWorkspaceForm() {
  const router = useRouter();
  const [host, setHost] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setSlugManuallyEdited(value.length > 0);
    if (!value) setSlugManuallyEdited(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSlug = slug.trim();
    const error = validateSlug(trimmedSlug);
    if (error) {
      setSlugError(error);
      return;
    }
    setSlugError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: trimmedSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create workspace");
      }

      router.push(`/${data.slug}/dashboard`);
    } catch (e) {
      toast("Failed to create workspace", {
        description: e instanceof Error ? e.message : "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const previewSlugError = slug ? validateSlug(slug) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup className="gap-4">
        <Field className="gap-1.5">
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <Input
            id="workspace-name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Acme Inc."
            required
          />
        </Field>
        <Field className="gap-1.5">
          <FieldLabel htmlFor="workspace-slug">Workspace URL</FieldLabel>
          <div className="flex items-center gap-1 rounded-md border bg-muted/30 px-3 text-muted-foreground text-sm">
            <span>{host}/</span>
            <Input
              id="workspace-slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="acme"
              className="border-0 bg-transparent px-0 focus-visible:ring-0"
              required
            />
          </div>
          {previewSlugError && (
            <p className="text-destructive text-xs">{previewSlugError}</p>
          )}
        </Field>
      </FieldGroup>
      <Button className="w-full" type="submit" disabled={submitting || !!previewSlugError}>
        {submitting ? "Creating..." : "Create workspace"}
      </Button>
    </form>
  );
}
