import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Star, Trash2 } from "lucide-react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Spinner,
} from "@/components/ui";

/**
 * Garde les object-URLs stables entre les rendus :
 * reutilise celles qui existent deja, revoque les supprimees.
 */
function useObjectUrls(files) {
  // Cache pour stocker les URLs associees a chaque fichier
  const cache = useRef(new Map());
  const [items, setItems] = useState([]);
  // A chaque changement de la liste de fichiers, on met a jour les URLs en cache
  useEffect(() => {
    const prev = cache.current;
    const next = new Map();
    // Creation de la nouvelle liste d'items avec URLs
    const result = files.map((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      const url = prev.get(key) ?? URL.createObjectURL(file);
      next.set(key, url);
      return { key, name: file.name, url };
    });
    // Revoque les URLs qui ne sont plus utilisees
    prev.forEach((url, key) => {
      if (!next.has(key)) URL.revokeObjectURL(url);
    });
    // Mise a jour du cache et des items a afficher
    cache.current = next;
    setItems(result);
    // Nettoyage a la destruction du composant : revoke toutes les URLs
    return () => {
      next.forEach((url) => URL.revokeObjectURL(url));
      cache.current = new Map();
    };
  }, [files]);
  // Retourne la liste des items avec leurs URLs stables pour l'affichage
  return items;
}

/**
 * Composant d'upload d'images pour les services.
 * Affiche une dropzone, un apercu en grille avec etoile sur l'image principale,
 * et des controles de deplacement / suppression.
 */
export function FichiersUploadItem({
  t,
  name,
  control,
  title,
  description,
  onSave,
  onReset,
  saveIsLoading = false,
  isChanged = false,
  maxFiles = 10,
  existingUrls = [],
}) {
  // Hook de traduction pour les textes du composant
  const { t: tValidation } = useTranslation("validation");
  // Hook de react-hook-form pour gerer le champ de fichiers
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: [],
  });
  // ID pour l'input de fichiers
  const inputId = useId();
  // Fichiers locaux actuellement selectionnes
  const files = field.value ?? [];
  // Indique s'il y a des fichiers locaux
  const hasLocalFiles = files.length > 0;
  // Items a afficher avec leurs URLs stables
  const previewItems = useObjectUrls(files);
  // Calcul du nombre de fichiers restants avant d'atteindre la limite
  const remaining = maxFiles - files.length;
  // Indique si la limite de fichiers a ete atteinte
  const isLimitReached = remaining <= 0;
  // Nombre total de fichiers a afficher (locaux ou existants)
  const currentCount = hasLocalFiles ? files.length : existingUrls.length;
  // Images a afficher : fichiers locaux ou URLs existantes
  const items = hasLocalFiles
    ? previewItems
    : existingUrls.filter(Boolean).map((url, i) => ({
        key: `existing-${i}`,
        name: `image-${i + 1}`,
        url,
      }));
  // Gestion du changement de fichiers : ajoute les nouveaux fichiers a la liste existante
  const handleFilesChange = useCallback(
    (e) => {
      const added = Array.from(e.target.files ?? []).slice(
        0,
        Math.max(maxFiles - files.length, 0),
      );
      if (added.length) field.onChange([...files, ...added]);
      e.target.value = "";
    },
    [field, files, maxFiles],
  );
  // Gestion de la suppression d'un fichier : retire le fichier de la liste
  const handleRemove = useCallback(
    (i) => field.onChange(files.filter((_, idx) => idx !== i)),
    [field, files],
  );
  // Gestion du deplacement d'un fichier : change l'ordre des fichiers dans la liste
  const handleMove = useCallback(
    (from, to) => {
      if (to < 0 || to >= files.length) return;
      const next = [...files];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      field.onChange(next);
    },
    [field, files],
  );

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
        <div className="my-3 space-y-3">
          <div className="space-y-2">
            <Input
              id={inputId}
              className="sr-only"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              disabled={saveIsLoading || isLimitReached}
            />
            <label
              htmlFor={inputId}
              className="block cursor-pointer rounded-lg border-2 border-dashed p-5 text-center transition-colors hover:border-primary hover:bg-muted/40"
            >
              <ImagePlus className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="font-medium">
                {t("services.form.fields.fichiers.placeholder")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLimitReached
                  ? t("services.form.fields.fichiers.limitReached", {
                      max: maxFiles,
                    })
                  : t("services.form.fields.fichiers.remaining", {
                      count: remaining,
                      max: maxFiles,
                    })}
              </p>
            </label>
            <p className="text-right text-sm text-muted-foreground">
              {currentCount}/{maxFiles}
            </p>
          </div>
          {items.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              <ImagePlus className="mx-auto mb-2 h-5 w-5" />
              {t("services.form.fields.fichiers.empty")}
            </div>
          )}
          {items.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {items.map((item, index) => (
                <div
                  key={item.key}
                  className="relative space-y-2 rounded-md border p-2"
                >
                  {index === 0 && (
                    <div className="absolute left-4 top-4 rounded-full bg-amber-400/90 p-1 text-amber-950 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                  )}
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-24 w-full rounded object-cover"
                  />
                  {hasLocalFiles && (
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleMove(index, index - 1)}
                        disabled={index === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleMove(index, index + 1)}
                        disabled={index === files.length - 1}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleRemove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {fieldState.error?.message && (
            <p className="text-sm text-destructive">
              {tValidation(fieldState.error.message, {
                attribute: title,
                max: maxFiles,
              })}
            </p>
          )}
        </div>
        {isChanged && (
          <div className="flex w-full gap-2">
            <Button
              type="button"
              className="w-fit"
              onClick={onSave}
              disabled={saveIsLoading}
            >
              {saveIsLoading && <Spinner />}
              {t("services.form.actions.upload")}
            </Button>
            <Button
              type="button"
              className="w-fit"
              variant="outline"
              onClick={onReset}
            >
              {t("services.form.actions.reset")}
            </Button>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}
