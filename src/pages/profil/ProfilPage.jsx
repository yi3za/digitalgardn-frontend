import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  CustomFormField,
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
  Textarea,
} from "@/components/ui";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { updateInfoSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import {
  updateFreelanceProfilThunk,
  updateInfoThunk,
  uploadAvatarThunk,
} from "@/features/auth/auth.thunks";
import {
  formatDate,
  getFallbackName,
  setServerErrors,
  toCapitalize,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, CameraIcon, Eye, Globe, Lock, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Definition des sheets disponibles
const SHEET = { PROFIL: { SHOW: "profile-show", EDIT: "profile-edit" } };

/**
 * Composant de la page de profil
 * Affiche les informations de l'utilisateur
 */
export function ProfilPage() {
  // Recupere les donnees de l'utilisateur authentifie
  const { user, loading } = useSelector(authSelector);
  // Fonction de traduction
  const { t } = useTranslation(["profil", "codes"]);
  // Etat local pour control l'edition de biographie
  const [biographieEdit, setBiographieEdit] = useState(false);
  // Generation du nom fallback pour l'avatar a partir du nom complet de l'utilisateur
  const avatarFallback = getFallbackName(user?.name);
  // Generation du nom de l'utilisateur avec la premiere lettre en majuscule pour l'affichage dans le profil
  const user_name = user?.name && toCapitalize(user.name);
  // Generation du titre professionnel de l'utilisateur pour l'affichage dans le profil
  const user_titre = `- ${
    user?.profil?.titre
      ? toCapitalize(user.profil.titre)
      : t("modifierInfo.fields.titre.placeholder")
  }`;
  // Formatage de la date d'inscription de l'utilisateur pour l'affichage dans le profil
  const date_incription = formatDate(user?.created_at);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Initialisation du formulaire avec les valeurs de l'utilisateur et validation basee sur updateInfoSchema
  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      titre: user?.profil?.titre ?? "",
      site_web: user?.profil?.site_web ?? "",
      biographie: user?.profil?.biographie ?? "",
      avatar: undefined,
    },
    resolver: zodResolver(updateInfoSchema),
  });
  // Sheet actuellement ouvert
  const [activeSheet, setActiveSheet] = useState(null);
  // Fermer le actif
  const closeSheet = () => setActiveSheet(null);
  // Function pour upload l'avatar de l'utilisateur
  const handleUploadAvatar = async (e) => {
    const avatar = e.target.files?.[0];
    form.setValue("avatar", avatar);
    if (await form.trigger("avatar")) {
      try {
        const { code } = await dispatch(uploadAvatarThunk({ avatar })).unwrap();
        toast.success(t(`codes:${code}`));
      } catch ({ code, details: errors }) {
        setServerErrors(errors, form.setError);
        toast.error(t(`codes:${code}`));
      }
    }
  };
  // Function pour mise a jour les informations
  const handleUpdateInfo = async () => {
    const name = form.getValues("name");
    if (await form.trigger("name")) {
      try {
        const { code } = await dispatch(updateInfoThunk({ name })).unwrap();
        toast.success(t(`codes:${code}`));
        form.resetField("name", { defaultValue: name });
      } catch ({ code, details: errors }) {
        setServerErrors(errors, form.setError);
        toast.error(t(`codes:${code}`));
      }
    }
  };
  // Function pour mise a jour du profil freelance
  const handleUpdateFreelanceProfil = async () => {
    const values = form.getValues();
    const { name, avatar, ...rest } = values;
    const dataKeys = Object.keys(rest).filter(
      (f) => form.formState.dirtyFields[f],
    );
    const data = Object.fromEntries(
      dataKeys.map((key) => [key, values[key].trim()]),
    );
    if (await form.trigger(dataKeys)) {
      try {
        const { code } = await dispatch(
          updateFreelanceProfilThunk(data),
        ).unwrap();
        toast.success(t(`codes:${code}`));
        form.reset({ ...values, ...data });
        if (data?.biographie) setBiographieEdit(false);
      } catch ({ code, details: errors }) {
        setServerErrors(errors, form.setError);
        toast.error(t(`codes:${code}`));
      }
    }
  };
  // Functionne pour control l'edition de biographie
  const handleBiographieEdit = () => {
    if (biographieEdit) {
      form.resetField("biographie", {
        defaultValue: user?.profil?.biographie ?? "",
      });
      setBiographieEdit(false);
    } else {
      setBiographieEdit(true);
    }
  };

  return (
    <Form {...form}>
      <ItemGroup className="gap-5">
        {user?.onboarding_termine && (
          <Item className="px-0">
            <ItemContent>
              <ItemTitle>{t("voirInfo.title")}</ItemTitle>
              <ItemDescription>{t("voirInfo.description")}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Sheet
                showCloseButton={false}
                open={activeSheet === SHEET.PROFIL.SHOW}
                onOpenChange={(open) => !open && closeSheet()}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="shadow-none"
                    onClick={() => setActiveSheet(SHEET.PROFIL.SHOW)}
                  >
                    <Eye />
                    {t("voirInfo.action")}
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-x-auto">
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
                        <ItemDescription>
                          {"@" + user?.username}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                    <ItemSeparator />
                    <Item>
                      <ItemMedia>
                        <User className="text-muted-foreground" size={16} />
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
        )}
        <Item variant="outline" className="gap-5">
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
            <ItemTitle>
              {`${user_name} ${
                user?.role === AUTH_ROLE.FREELANCE ? user_titre : ""
              }`}
            </ItemTitle>
            <ItemDescription>{"@" + user?.username}</ItemDescription>
            <ItemDescription className="flex items-center gap-5 mt-5">
              <span className="flex items-center gap-2">
                <User size={16} />
                {t("meta.joined", { date: date_incription })}
              </span>
              {user?.role === AUTH_ROLE.FREELANCE && (
                <a
                  className="flex items-center gap-2"
                  href={user?.profil?.site_web ?? "#"}
                  target="_blank"
                >
                  <Globe size={16} />
                  {user?.profil?.site_web ??
                    t("modifierInfo.fields.site_web.placeholder")}
                </a>
              )}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="self-start">
            <Sheet
              showCloseButton={false}
              open={activeSheet === SHEET.PROFIL.EDIT}
              onOpenChange={(open) => {
                if (!open) {
                  closeSheet();
                  form.reset();
                }
              }}
            >
              <SheetTrigger asChild>
                <Button
                  variant="link"
                  className="pt-0 h-fit"
                  onClick={() => setActiveSheet(SHEET.PROFIL.EDIT)}
                >
                  {t("actions.edit")}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-x-auto">
                <SheetHeader>
                  <SheetTitle>{t("modifierInfo.title")}</SheetTitle>
                  <SheetDescription>
                    {t("modifierInfo.description")}
                  </SheetDescription>
                </SheetHeader>
                <Separator />
                <FieldSet disabled={loading.updateInfo} className="p-5">
                  <FieldGroup>
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => {
                        const { value, onChange, ...rest } = field;
                        return (
                          <FormItem className="w-fit mx-auto rounded-full">
                            <FormLabel className="relative pt-0 rounded-full cursor-pointer">
                              <Avatar className="relative mx-auto size-20 bg-accent flex items-center justify-center">
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
                              <CameraIcon className="absolute bottom-0 right-0 border size-6 rounded-full bg-muted p-1" />
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  {...rest}
                                  onChange={handleUploadAvatar}
                                  disabled={loading.uploadAvatar}
                                />
                              </FormControl>
                            </FormLabel>
                            <FormMessage
                              rules={{
                                attribute: t(
                                  "modifierInfo.fields.avatar.label",
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
                    <CustomFormField
                      control={form.control}
                      name="name"
                      label={t("modifierInfo.fields.name.label")}
                      placeholder={t("modifierInfo.fields.name.placeholder")}
                      description={t("modifierInfo.fields.name.description")}
                      rules={{ max: 255 }}
                      icon={User}
                    />
                    {form.formState.dirtyFields?.name && (
                      <Button
                        onClick={handleUpdateInfo}
                        disabled={loading.updateInfo}
                      >
                        {loading.updateInfo && <Spinner />}
                        {t("actions.save")}
                      </Button>
                    )}
                    <CustomFormField
                      control={form.control}
                      name="titre"
                      label={t("modifierInfo.fields.titre.label")}
                      placeholder={t("modifierInfo.fields.titre.placeholder")}
                      description={t("modifierInfo.fields.titre.description")}
                      rules={{ min: 10, max: 255 }}
                      icon={Briefcase}
                    />
                    {form.formState.dirtyFields?.titre && (
                      <Button
                        onClick={handleUpdateFreelanceProfil}
                        disabled={loading.updateFreelanceProfil}
                      >
                        {loading.updateFreelanceProfil && <Spinner />}
                        {t("actions.save")}
                      </Button>
                    )}
                    <CustomFormField
                      control={form.control}
                      name="site_web"
                      label={t("modifierInfo.fields.site_web.label")}
                      placeholder={t(
                        "modifierInfo.fields.site_web.placeholder",
                      )}
                      description={t(
                        "modifierInfo.fields.site_web.description",
                      )}
                      rules={{ max: 255 }}
                      icon={Globe}
                    />
                    {form.formState.dirtyFields?.site_web && (
                      <Button
                        onClick={handleUpdateFreelanceProfil}
                        disabled={loading.updateFreelanceProfil}
                      >
                        {loading.updateFreelanceProfil && <Spinner />}
                        {t("actions.save")}
                      </Button>
                    )}
                    <FormItem>
                      <FormLabel>
                        {t("modifierInfo.fields.username.label")}
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
                        {t("modifierInfo.fields.username.description")}
                      </FormDescription>
                    </FormItem>
                  </FieldGroup>
                </FieldSet>
              </SheetContent>
            </Sheet>
          </ItemActions>
        </Item>
        {user?.role === AUTH_ROLE.FREELANCE && (
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>{t("modifierInfo.fields.biographie.label")}</ItemTitle>
              <ItemDescription>
                {t("modifierInfo.fields.biographie.description")}
              </ItemDescription>
              <FormField
                control={form.control}
                name="biographie"
                render={({ field }) => {
                  const length = field.value?.length || 0;
                  const maxLength = 600;
                  return (
                    <FormItem className="mt-3">
                      {biographieEdit ? (
                        <div className="relative">
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={loading.updateFreelanceProfil}
                              placeholder={t(
                                "modifierInfo.fields.biographie.placeholder",
                              )}
                              autoFocus
                              className="min-h-30"
                            />
                          </FormControl>
                          <div className="absolute bottom-2 right-2">
                            {length}/{maxLength}
                          </div>
                        </div>
                      ) : (
                        <ItemDescription className="line-clamp-10">
                          {user?.profil?.biographie
                            ? toCapitalize(user.profil.biographie)
                            : t("modifierInfo.fields.biographie.placeholder")}
                        </ItemDescription>
                      )}
                      <FormMessage
                        rules={{
                          attribute: t("modifierInfo.fields.biographie.label"),
                          min: 150,
                          max: maxLength,
                        }}
                      />
                    </FormItem>
                  );
                }}
              />
              {form.formState.dirtyFields?.biographie && (
                <Button
                  onClick={handleUpdateFreelanceProfil}
                  disabled={loading.updateFreelanceProfil}
                  className="w-fit mt-2"
                >
                  {loading.updateFreelanceProfil && <Spinner />}
                  {t("actions.save")}
                </Button>
              )}
            </ItemContent>
            <ItemActions className="self-start">
              <Button
                variant="link"
                className="pt-0 h-fit"
                onClick={handleBiographieEdit}
              >
                {biographieEdit ? t("actions.cancel") : t("actions.edit")}
              </Button>
            </ItemActions>
          </Item>
        )}
      </ItemGroup>
    </Form>
  );
}
