import * as yup from "yup";
import { EmpresaForm } from "./type";

export const empresaSchema: yup.ObjectSchema<EmpresaForm> = yup.object({
  nome: yup.string().required("Nome é obrigatório"),

  descricao: yup.string().required("Descrição é obrigatória"),

  cor: yup.string().required(),

  consentimento: yup.boolean().required(),

  camposPadrao: yup.object({
    nome: yup.boolean().required(),
    faixaEtaria: yup.boolean().required(),
  }),

  camposCustomizados: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required(),
        tipo: yup
          .mixed<"objetiva" | "dissertativa">()
          .oneOf(["objetiva", "dissertativa"])
          .required(),
        opcoes: yup.string(),
      })
    )
    .required(),
});
