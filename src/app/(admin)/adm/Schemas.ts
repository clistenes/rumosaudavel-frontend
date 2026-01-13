import * as yup from "yup";
import { FormData } from "./types";

export const editUserSchema= yup.object({
  nome: yup
    .string()
    .required("Nome é obrigatório"),
  login: yup
    .string()
    .required("Login é obrigatório"),
  senha: yup
    .string()
    .transform((value) => (value === "" || value === null ? undefined : value))
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .notRequired(),
});
