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

// Genere une cle unique pour un fichier ajoute
export const getNewFileKey = (item) => {
  const file = item.file;
  return `${item.id}:${file.name}:${file.size}:${file.lastModified}`;
};

// Genere un nouvel item de fichier a partir d'un fichier ajoute
const createNewFichierItem = (file) => ({
  type: "new",
  id: crypto.randomUUID?.() ?? `${file.name}-${file.size}-${Date.now()}`,
  file,
});

// Genere un nom d'affichage pour un item de fichier
const getItemName = (item, index) => {
  if (item.type === "existing") return item.name ?? `image-${index + 1}`;
  return item.file.name;
};

// Hook de gestion des apercus des fichiers, avec creation et revocation des object URLs pour les fichiers locaux
function usePreviewItems(items) {
  // Map de cle d'item a object URL pour les fichiers locaux
  const objectUrls = useRef(new Map());
  // Liste des apercus a afficher, avec structure uniforme pour les fichiers existants et nouveaux
  const [previews, setPreviews] = useState([]);
  // A chaque changement de la liste d'items, on met a jour les apercus et les object URLs
  useEffect(() => {
    const activeKeys = new Set();
    const nextPreviews = items.map((item, index) => {
      if (item.type === "existing") {
        return {
          key: `existing-${item.id}`,
          name: getItemName(item, index),
          url: item.url,
        };
      }
      // Pour les fichiers locaux, on genere une cle unique et on cree une object URL si necessaire
      const key = getNewFileKey(item);
      activeKeys.add(key);
      if (!objectUrls.current.has(key)) {
        objectUrls.current.set(key, URL.createObjectURL(item.file));
      }
      return {
        key,
        name: getItemName(item, index),
        url: objectUrls.current.get(key),
      };
    });
    // On revoke les object URLs qui ne sont plus associees a des items actifs
    objectUrls.current.forEach((url, key) => {
      if (!activeKeys.has(key)) {
        URL.revokeObjectURL(url);
        objectUrls.current.delete(key);
      }
    });
    // On met a jour les apercus a afficher
    setPreviews(nextPreviews);
  }, [items]);
  // A la destruction du composant, on revoke toutes les object URLs encore actives
  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    },
    [],
  );
  // On retourne la liste des apercus a afficher, avec les URLs a jour pour les fichiers locaux
  return previews;
}

/**
 * Upload et gestion de la galerie des images d'un service.
 * La valeur du champ est la source unique pour les images existantes et nouvelles.
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
}) {
  // Traduction des messages de validation, avec namespace "validation" pour les erreurs generiques
  const { t: tValidation } = useTranslation("validation");
  // Utilisation de useController pour connecter le composant a react-hook-form, avec une valeur par defaut de liste vide
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: [],
  });
  // Generation d'un ID unique pour l'input de fichiers
  const inputId = useId();
  // Recuperation de la liste des items de fichiers
  const items = field.value ?? [];
  // Utilisation du hook de gestion des apercus pour obtenir les URLs a afficher pour les items actuels
  const previews = usePreviewItems(items);
  const remaining = maxFiles - items.length;
  const isLimitReached = remaining <= 0;
  // Fonction de mise a jour de la liste des items, qui met a jour la valeur du champ et declenche la validation
  const updateItems = useCallback(
    (nextItems) => {
      field.onChange(nextItems);
      field.onBlur();
    },
    [field],
  );
  // Gestion du changement de fichiers
  const handleFilesChange = useCallback(
    (e) => {
      const added = Array.from(e.target.files ?? [])
        .slice(0, Math.max(remaining, 0))
        .map(createNewFichierItem);
      if (added.length) updateItems([...items, ...added]);
      e.target.value = "";
    },
    [items, remaining, updateItems],
  );
  // Gestion de la suppression d'un fichier
  const handleRemove = useCallback(
    (index) => updateItems(items.filter((_, i) => i !== index)),
    [items, updateItems],
  );
  // Gestion du deplacement d'un fichier dans la liste
  const handleMove = useCallback(
    (from, to) => {
      if (to < 0 || to >= items.length) return;
      const nextItems = [...items];
      const [moved] = nextItems.splice(from, 1);
      nextItems.splice(to, 0, moved);
      updateItems(nextItems);
    },
    [items, updateItems],
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
              {items.length}/{maxFiles}
            </p>
          </div>
          {previews.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              <ImagePlus className="mx-auto mb-2 h-5 w-5" />
              {t("services.form.fields.fichiers.empty")}
            </div>
          )}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {previews.map((item, index) => (
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
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMove(index, index - 1)}
                      disabled={index === 0 || saveIsLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMove(index, index + 1)}
                      disabled={index === items.length - 1 || saveIsLoading}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRemove(index)}
                      disabled={saveIsLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {fieldState?.error && (
            <p className="text-sm text-destructive">
              {tValidation(fieldState?.error?.message, {
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
              {t("common:actions.upload")}
            </Button>
            <Button
              type="button"
              className="w-fit"
              variant="outline"
              onClick={onReset}
              disabled={saveIsLoading}
            >
              {t("common:actions.reset")}
            </Button>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}
