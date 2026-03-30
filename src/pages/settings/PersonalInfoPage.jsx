import {
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  CardContent,
  ItemGroup,
  Item,
  ItemTitle,
  ItemDescription,
  ItemContent,
  ItemActions,
  ItemSeparator,
  Form,
  Spinner,
  CustomFormField,
} from "@/components/ui";
import { updateInfoSchema } from "@/features/auth/auth.schemas";
import { authSelector } from "@/features/auth/auth.selectors";
import { updateInfoThunk } from "@/features/auth/auth.thunks";
import { setServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Mail, User } from "lucide-react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Definition des champs du formulaire avec leurs regles de validation
const fields = [
  { name: "name", rules: { max: 255 }, icon: User },
  { name: "username", rules: { min: 3, max: 30 }, icon: AtSign },
  { name: "email", rules: { max: 255 }, icon: Mail },
];

/**
 * Page de gestion des informations personnelles de l'utilisateur
 */
export function PersonalInfoPage() {
  // Hook de traduction
  const { t } = useTranslation(["settings", "codes"]);
  // Dispatcher pour les actions
  const dispatch = useDispatch();
  // Recuperation des informations de l'utilisateur
  const { user } = useSelector(authSelector);
  // Initialisation du formulaire avec les valeurs de l'utilisateur et validation basee sur updateInfoSchema
  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
    resolver: zodResolver(updateInfoSchema),
  });
  // Etat local pour suivre les champs en cours d'edition
  const [editingFields, setEditingFields] = useState([]);
  // Etat local pour suivre les champs en cours de soumission
  const [submittingFields, setSubmittingFields] = useState([]);
  // Fonction pour verifier si un champ est en mode edition
  const isEditing = (field) => editingFields.includes(field);
  // Fonction pour verifier si un champ est en cours de soumission
  const isSubmitting = (field) => submittingFields.includes(field);
  // Fonction pour basculer le mode edition d'un champ
  const toggleField = (field, newValue = null) => {
    // Si on desactive le mode edition, reset le champ pour annuler les modifications
    if (isEditing(field))
      form.resetField(field, { defaultValue: newValue ?? user?.[field] ?? "" });
    setEditingFields((prev) =>
      isEditing(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };
  // Fonction d'envoie des modifications d'un champ
  const handleSave = async (field) => {
    // Valider le champ avant de l'envoyer
    if (await form.trigger(field)) {
      // Recuperer la valeur du champ a envoyer
      const value = form.getValues(field);
      // Envoyer la modification du champ
      return submit({ [field]: value });
    }
  };
  // Fonction de soumission du formulaire
  const submit = async (data) => {
    // Recuperer le nom du champ modifie
    const field = Object.keys(data)[0];
    try {
      // Ajouter le champ a la liste des champs en cours de soumission
      setSubmittingFields((prev) => [...prev, field]);
      // Envoyer les modifications
      const UpdateUser = await dispatch(updateInfoThunk(data)).unwrap();
      // Basculer le champ en mode non edition et mettre a jour sa valeur
      toggleField(field, UpdateUser?.[field]);
      // Afficher message de succes
      toast.success(
        t("toast.update_success", {
          field: t(`items.personal_info.fields.labels.${field}`),
        }),
      );
    } catch ({ code, details: errors }) {
      // Afficher les erreurs du serveur dans le formulaire
      setServerErrors(errors, form.setError);
      // Afficher notification d'erreur
      toast.error(t(`codes:${code}`));
    } finally {
      // Retirer le champ de la liste des champs en cours de soumission
      setSubmittingFields((prev) => prev.filter((f) => f !== field));
    }
  };

  return (
    <>
      {/* En-tete de la carte */}
      <CardHeader>
        <CardTitle>{t("items.personal_info.title")}</CardTitle>
        <CardDescription>
          {t("items.personal_info.description")}
        </CardDescription>
      </CardHeader>
      {/* Contenu de la carte */}
      <CardContent>
        <Form {...form}>
          <ItemGroup>
            {fields.map(({ name, rules, icon }, index, array) => {
              const fieldIsEditing = isEditing(name);
              const fieldIsSubmitting = isSubmitting(name);
              const isNotDirty = !form.formState.dirtyFields?.[name];
              const label = t(`items.personal_info.fields.labels.${name}`);
              const placeholder = t("items.personal_info.fields.placeholder", {
                field: label.toLowerCase(),
              });

              return (
                <Fragment key={name}>
                  <Item>
                    <ItemContent>
                      <ItemTitle>{label}</ItemTitle>
                      {fieldIsEditing ? (
                        <>
                          <CustomFormField
                            name={name}
                            control={form.control}
                            placeholder={placeholder}
                            disabled={fieldIsSubmitting}
                            rules={{ ...rules }}
                            icon={icon}
                          />
                          <Button
                            className="w-fit mt-3"
                            disabled={isNotDirty || fieldIsSubmitting}
                            onClick={() => handleSave(name)}
                          >
                            {fieldIsSubmitting && <Spinner />}
                            {t("action.save", {
                              field: label.toLowerCase(),
                            })}
                          </Button>
                        </>
                      ) : (
                        <ItemDescription>
                          {name === "username"
                            ? `@${user?.[name] ?? ""}`
                            : (user?.[name] ?? "")}
                        </ItemDescription>
                      )}
                    </ItemContent>
                    <ItemActions className="self-start">
                      <Button
                        variant="link"
                        className="pt-0 h-fit"
                        onClick={() => toggleField(name)}
                      >
                        {t(fieldIsEditing ? "action.cancel" : "action.edit")}
                      </Button>
                    </ItemActions>
                  </Item>
                  {index !== array.length - 1 && <ItemSeparator />}
                </Fragment>
              );
            })}
          </ItemGroup>
        </Form>
      </CardContent>
    </>
  );
}
