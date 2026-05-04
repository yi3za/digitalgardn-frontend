import { client, contentTypeMultipart } from "@/api/client";

// Liste toutes les competences
export const getAdminCompetences = async () => {
  const { data } = await client.get("/api/admin/competences");
  return data?.details?.competences ?? [];
};

// Detail d'une competence par slug (quel que soit son statut)
export const getAdminCompetenceBySlug = async (slug) => {
  const { data } = await client.get(`/api/admin/competences/${slug}`);
  return data?.details?.competence ?? null;
};

// Services d'une competence (quel que soit leur statut)
export const getAdminServicesByCompetence = async (slug) => {
  const { data } = await client.get(`/api/admin/competences/${slug}/services`);
  return data?.details?.services ?? [];
};

// Creer une competence
export const createAdminCompetence = async (payload) => {
  const { data } = await client.post(
    "/api/admin/competences",
    payload,
    contentTypeMultipart,
  );
  return data?.details?.competence ?? null;
};

// Modifier une competence
export const updateAdminCompetence = async ({ id, ...payload }) => {
  const { data } = await client.post(
    `/api/admin/competences/${id}`,
    payload,
    contentTypeMultipart,
  );
  return data?.details?.competence ?? null;
};

// Supprimer une competence
export const deleteAdminCompetence = async (id) => {
  await client.delete(`/api/admin/competences/${id}`);
};
