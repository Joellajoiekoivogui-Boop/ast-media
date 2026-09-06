"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setError("Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Image de couverture"
          className="mb-3 aspect-video w-full max-w-md rounded-lg object-cover"
        />
      ) : (
        <div className="mb-3 flex aspect-video w-full max-w-md items-center justify-center rounded-lg border border-dashed border-card-border text-sm text-muted-foreground">
          Aucune image
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-md border border-card-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
      >
        {uploading ? "Envoi…" : value ? "Changer l'image" : "Choisir une image"}
      </button>
      {error && <p className="mt-1 text-sm text-primary">{error}</p>}
    </div>
  );
}
