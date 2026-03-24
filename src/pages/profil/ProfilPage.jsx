import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  Input,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Spinner,
} from "@/components/ui";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  updateInfoThunk,
  uploadAvatarThunk,
} from "@/features/auth/auth.thunks";
import { formatDate, getFallbackName } from "@/lib/utils";
import { CameraIcon, Eye, Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

/**
 * Composant de la page de profil
 * Affiche les informations de l'utilisateur
 */
export function ProfilPage() {
  // Recupere les donnees de l'utilisateur authentifie
  const { user, loading } = useSelector(authSelector);
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'utilisateur
  const avatarFallback = getFallbackName(user?.name);
  // Generation du nom de l'utilisateur avec la premiere lettre en majuscule pour l'affichage dans le profil
  const user_name =
    user?.name && user.name.charAt(0).toUpperCase() + user.name.slice(1);
  // Formatage de la date d'inscription de l'utilisateur pour l'affichage dans le profil
  const date_incription = formatDate(user?.created_at);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Fonction de traduction
  const { t } = useTranslation(["profil", "codes", "validation"]);
  // Etat local pour le nom de l'utilisateur
  const [name, setName] = useState(user?.name ?? "");
  // Etat local pour les erreurs de validation
  const [errors, setErrors] = useState({});
  // Fonction de validation des donnees avant de dispatch l'action de mise a jour
  const validate = (fieldName, file) => {
    // Validation du fichier de l'avatar : taille maximale de 2Mo
    if (fieldName === "avatar" && file instanceof File) {
      // Types de fichiers acceptes pour l'avatar
      const types = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      // Validation du type de fichier de l'avatar
      if (!types.includes(file.type)) {
        setErrors({ avatar: ["validation.mimes"] });
        return false;
      }
      // Validation de la taille du fichier de l'avatar
      if (file.size > 2048 * 1024) {
        setErrors({ avatar: ["validation.max.file"] });
        return false;
      }
    }
    // Validation du nom de l'utilisateur : requis et longueur maximale de 255 caracteres
    if (fieldName === "name") {
      // Validation de la presence du nom de l'utilisateur
      if (!name.trim()) {
        setErrors({ name: ["validation.required"] });
        return false;
      }
      // Validation de la longueur du nom de l'utilisateur
      if (name.length > 255) {
        setErrors({ name: ["validation.max.string"] });
        return false;
      }
    }
    // Reinitialisation des erreurs avant de dispatch l'action
    setErrors({});
    return true;
  };
  // Fonction de gestion des changements d'informations du compte
  const handleAccountChanges = async (e) => {
    // Determine le champ modifie (avatar ou name) et le fichier de l'avatar si applicable
    const fieldName = e.target.name === "avatar" ? "avatar" : "name";
    // Recuperation du fichier de l'avatar si le champ modifie est l'avatar
    const file = e.target.files?.[0] ?? null;
    // Validation des donnees avant de dispatch l'action
    if (!validate(fieldName, file)) return;
    // Determine l'action a dispatcher en fonction du champ modifie (avatar ou name)
    const action =
      e.target.name === "avatar"
        ? uploadAvatarThunk({ avatar: file })
        : updateInfoThunk({ name });
    // Dispatch de l'action et gestion des erreurs
    try {
      await dispatch(action).unwrap();
      setErrors({});
      toast.success(
        t(`toast.${fieldName === "avatar" ? "successAvatar" : "successName"}`),
      );
    } catch ({ code, details }) {
      setErrors(details ?? {});
      toast.error(t(`codes:${code}`));
    }
  };

  return (
    <ItemGroup className="grid grid-cols-4 gap-5">
      <Item className="col-span-3 px-0">
        <ItemContent>
          <ItemTitle>{t("voirInfo.title")}</ItemTitle>
          <ItemDescription>{t("voirInfo.description")}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <Eye />
                {t("voirInfo.action")}
              </Button>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="overflow-x-auto">
              <SheetHeader>
                <SheetTitle>{t("voirInfo.sheet.title")}</SheetTitle>
                <SheetDescription>
                  {t("voirInfo.sheet.description")}
                </SheetDescription>
              </SheetHeader>
              <Separator />
              <ItemGroup className="px-4">
                <Item className="mb-4">
                  <ItemHeader className="justify-center">
                    <Avatar className="size-30">
                      <AvatarImage
                        src={user?.avatar_url}
                        alt={user?.username}
                      />
                      <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                  </ItemHeader>
                  <ItemContent className="items-center">
                    <ItemTitle>{user_name}</ItemTitle>
                    <ItemDescription>{"@" + user?.username}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item>
                  <ItemMedia>
                    <UserRound className="text-muted-foreground" size={16} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemDescription>
                      {t("meta.joined", { date: date_incription })}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">{t("actions.close")}</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </ItemActions>
      </Item>
      <Item variant="outline" className="col-span-3 gap-5">
        <ItemMedia>
          <Avatar className="size-20">
            <AvatarImage
              src={user?.avatar_url}
              alt={user?.username}
              title={user?.name}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{user_name}</ItemTitle>
          <ItemDescription>{"@" + user?.username}</ItemDescription>
          <ItemDescription className="flex items-center gap-2 mt-5">
            <UserRound size={16} />
            {t("meta.joined", { date: date_incription })}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="self-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link">{t("actions.edit")}</Button>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="overflow-x-auto">
              <SheetHeader>
                <SheetTitle>{t("modifierInfo.sheet.title")}</SheetTitle>
                <SheetDescription>
                  {t("modifierInfo.sheet.description")}
                </SheetDescription>
              </SheetHeader>
              <Separator />
              <FieldSet disabled={loading.updateInfo} className="p-5">
                <FieldGroup>
                  <Field className="w-fit mx-auto rounded-full">
                    <FieldLabel className="pt-0 rounded-full">
                      <Avatar className="cursor-pointer mx-auto size-20 bg-accent flex items-center justify-center">
                        {loading.uploadAvatar ? (
                          <Spinner className="size-6" />
                        ) : (
                          <>
                            <CameraIcon
                              size="35"
                              color="white"
                              className="absolute p-5 w-full h-full bg-black opacity-0 hover:opacity-60 transition duration-400"
                            />
                            <AvatarImage
                              src={user?.avatar_url}
                              alt={user?.username}
                            />
                          </>
                        )}
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <Input
                        type="file"
                        name="avatar"
                        onChange={handleAccountChanges}
                        accept="image/*"
                        hidden
                      />
                    </FieldLabel>
                    <FieldError className="text-center">
                      {errors?.avatar &&
                        t(`validation:${errors.avatar[0]}`, {
                          attribute: t(
                            "modifierInfo.sheet.fields.avatar.label",
                          ),
                          values: "jpeg,jpg,png,webp",
                          max: 2048,
                        })}
                    </FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="name">
                      {t("modifierInfo.sheet.fields.name.label")}
                    </FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      placeholder={t(
                        "modifierInfo.sheet.fields.name.placeholder",
                      )}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FieldError>
                      {errors?.name &&
                        t(`validation:${errors.name[0]}`, {
                          attribute: t("modifierInfo.sheet.fields.name.label"),
                          max: 255,
                        })}
                    </FieldError>
                    <FieldDescription>
                      {t("modifierInfo.sheet.fields.name.description")}
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="username">
                      {t("modifierInfo.sheet.fields.username.label")}
                    </FieldLabel>
                    <div className="relative">
                      <Lock
                        className="absolute -translate-1/2 right-0 top-1/2 mx-1 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="username"
                        disabled
                        defaultValue={"@" + user?.username}
                      />
                    </div>
                    <FieldDescription>
                      {t("modifierInfo.sheet.fields.username.description")}{" "}
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Separator />
              <SheetFooter>
                {user?.name !== name && (
                  <Button
                    size="lg"
                    onClick={handleAccountChanges}
                    disabled={loading.updateInfo}
                  >
                    {loading.updateInfo && <Spinner />}
                    {t("actions.save")}
                  </Button>
                )}
                <SheetClose asChild>
                  <Button
                    onClick={() => {
                      setErrors({});
                      setName(user?.name);
                    }}
                    variant="outline"
                  >
                    {t("actions.close")}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
