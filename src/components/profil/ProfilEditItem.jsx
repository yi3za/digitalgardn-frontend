import { Briefcase, CameraIcon, Globe, Lock, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  CustomFormField,
  FieldGroup,
  FieldSet,
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
  ItemMedia,
  ItemTitle,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Spinner,
} from "../ui";
import { AUTH_ROLE } from "@/features/auth/auth.constants";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setServerErrors } from "@/lib/utils";
import {
  updateInfoThunk,
  uploadAvatarThunk,
} from "@/features/auth/auth.thunks";

const { FREELANCE } = AUTH_ROLE;

/**
 * Composant de la page de profil
 * Pour l'idition des informations de l'utilisateur
 */
export function ProfilEditItem({
  t,
  user,
  user_name,
  user_titre,
  date_incription,
  activeSheet,
  setBiographieEdit,
  closeSheet,
  setActiveSheet,
  loading,
  form,
  avatarFallback,
  SHEET,
  handleUpdateFreelanceProfil,
}) {
  // dispatch des actions
  const dispatch = useDispatch();
  // Function pour upload l'avatar de l'utilisateur
  const handleUploadAvatar = async (e) => {
    const avatar = e.target.files?.[0];
    form.setValue("avatar", avatar);
    if (await form.trigger("avatar")) {
      try {
        const { code } = await dispatch(uploadAvatarThunk({ avatar })).unwrap();
        toast.success(t(`codes:${code}`));
        form.resetField("avatar", { defaultValue: avatar });
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

  return (
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
          {`${user_name} ${user?.role === FREELANCE ? user_titre : ""}`}
        </ItemTitle>
        <ItemDescription>{"@" + user?.username}</ItemDescription>
        <ItemDescription className="flex items-center gap-5 mt-5">
          <span className="flex items-center gap-2">
            <User size={16} />
            {t("meta.joined", { date: date_incription })}
          </span>
          {user?.role === FREELANCE && (
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
            setBiographieEdit(false);
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
                      <FormItem>
                        <div className="relative w-fit mx-auto">
                          <FormLabel className="pt-0 rounded-full cursor-pointer">
                            <Avatar className="flex items-center justify-center size-20 bg-accent">
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
                            <CameraIcon className="absolute bottom-0 right-0 border size-6 rounded-full bg-muted p-1" />
                          </FormLabel>
                        </div>
                        <FormMessage
                          rules={{
                            attribute: t("modifierInfo.fields.avatar.label"),
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
                {user?.role === FREELANCE && (
                  <>
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
                  </>
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
                    <Input disabled defaultValue={`@${user?.username ?? ""}`} />
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
  );
}
