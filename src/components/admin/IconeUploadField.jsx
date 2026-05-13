import { useState, useEffect } from "react";
import { ImageUp } from "lucide-react";
import { FormField, FormItem, FormMessage } from "@/components/ui";

/**
 * Champ d'upload d'icone partage entre categories et competences
 * Affiche un apercu de l'image selectionnee
 */
export function IconeUploadField({ control, label, open }) {
  const [preview, setPreview] = useState(null);
  // Reinitialiser le preview a chaque changement d'etat du dialog
  useEffect(() => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  }, [open]);

  return (
    <FormField
      name="icone"
      control={control}
      render={({ field: { value: _value, onChange, ...field } }) => (
        <FormItem>
          <label
            htmlFor="icone"
            className="flex cursor-pointer items-center gap-5 rounded-md border border-dashed bg-muted/40 p-3 transition hover:border-primary hover:bg-muted"
          >
            {preview ? (
              <img src={preview} className="size-12 rounded object-cover" />
            ) : (
              <ImageUp className="size-6 text-muted-foreground" />
            )}
            <span>{label}</span>
          </label>
          <input
            id="icone"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onChange(file);
              if (preview) URL.revokeObjectURL(preview);
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
