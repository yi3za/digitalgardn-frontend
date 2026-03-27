import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FieldGroup,
  FieldSet,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { updateInfoSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  updateInfoThunk,
  uploadAvatarThunk,
} from "@/features/auth/auth.thunks";
import { formatDate, getFallbackName, setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon, Eye, Lock, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
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
  const { t } = useTranslation(["profil", "codes"]);
  // Hook de formulaire
  const form = useForm({
    defaultValues: { name: user?.name ?? "", avatar: undefined },
    resolver: zodResolver(updateInfoSchema),
  });
  // Gestion du changement de l'avatar pour le mettre a jour
  const handleAvatarChange = (e) => {
    // Recuperer le fichier de l'avatar selectionne
    const avatarFile = e.target.files?.[0];
    // Mettre a jour la valeur du champ avatar du formulaire avec le fichier selectionne
    form.setValue("avatar", avatarFile);
    handleAccountChanges(e);
  };
  // Fonction de gestion des modifications du profil
  const handleAccountChanges = async (e) => {
    // Recupere les valeurs du formulaire
    const { avatar, ...rest } = form.getValues();
    // Determiner le champ modifie (avatar ou (name, ...))
    const data = e.target.type === "file" ? { avatar } : rest;
    // Recuperer les cles des champs modifies pour les valider avant de les soumettre
    const dataKeys = Object.keys(data);
    // Valider les champs modifies
    if (await form.trigger(dataKeys)) {
      // Soumet les modifications du profil
      return submit(data);
    }
  };
  // Fonction de soumission des modifications du profil
  const submit = async (data) => {
    // Verifier si c'est une mise a jour de l'avatar ou des informations personnelles
    const isAvatarUpdate = !!data?.avatar;
    // Choisir le thunk selon si c'est une modification d'avatar ou d'informations personnelles
    const action = isAvatarUpdate ? uploadAvatarThunk : updateInfoThunk;
    try {
      // Envoyer la requete de modification du profil
      await dispatch(action(data)).unwrap();
      // Afficher un toast de succes
      const messageKey = isAvatarUpdate ? "successAvatar" : "successName";
      toast.success(t(`toast.${messageKey}`));
    } catch ({ code, details: errors }) {
      // Afficher les erreurs de validation ou une erreur generique
      setServerErrors(errors, form.setError);
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
              <Button variant="outline" className="shadow-none">
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
              <Button variant="link" className="pt-0 h-fit">
                {t("actions.edit")}
              </Button>
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
                <Form {...form}>
                  <FieldGroup>
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => {
                        const { value, onChange, ...rest } = field;
                        return (
                          <FormItem className="w-fit mx-auto rounded-full">
                            <FormLabel className="pt-0 rounded-full cursor-pointer">
                              <Avatar className="mx-auto size-20 bg-accent flex items-center justify-center">
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
                                <AvatarFallback>
                                  {avatarFallback}
                                </AvatarFallback>
                              </Avatar>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  {...rest}
                                  onChange={handleAvatarChange}
                                  disabled={loading.uploadAvatar}
                                />
                              </FormControl>
                            </FormLabel>
                            <FormMessage
                              rules={{
                                attribute: t(
                                  "modifierInfo.sheet.fields.avatar.label",
                                ),
                                values: "jpeg,jpg,png,webp",
                                max: 2048,
                              }}
                              className="text-center"
                            />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => {
                        const label = t("modifierInfo.sheet.fields.name.label");
                        return (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading.updateInfo}
                                placeholder={t(
                                  "modifierInfo.sheet.fields.name.placeholder",
                                )}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage
                              rules={{ attribute: label, max: 255 }}
                            />
                            <FormDescription>
                              {t("modifierInfo.sheet.fields.name.description")}
                            </FormDescription>
                          </FormItem>
                        );
                      }}
                    />
                    <FormItem>
                      <FormLabel>
                        {t("modifierInfo.sheet.fields.username.label")}
                      </FormLabel>
                      <div className="relative">
                        <Lock
                          className="absolute -translate-1/2 right-0 top-1/2 mx-1 text-gray-400"
                          size={16}
                        />
                        <Input
                          disabled
                          defaultValue={`@${user?.username ?? ""}`}
                        />
                      </div>
                      <FormDescription>
                        {t("modifierInfo.sheet.fields.username.description")}
                      </FormDescription>
                    </FormItem>
                  </FieldGroup>
                </Form>
              </FieldSet>
              <Separator />
              <SheetFooter>
                {form.formState.dirtyFields?.name && (
                  <Button
                    size="lg"
                    onClick={(e) => handleAccountChanges(e)}
                    disabled={loading.updateInfo}
                  >
                    {loading.updateInfo && <Spinner />}
                    {t("actions.save")}
                  </Button>
                )}
                <SheetClose asChild>
                  <Button
                    onClick={() =>
                      form.resetField("name", {
                        defaultValue: user?.name ?? "",
                      })
                    }
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
