export type CampoCustomizado = {
  label: string;
  tipo: "objetiva" | "dissertativa";
  opcoes?: string | null;
};

export type EmpresaForm = {
  nome: string;
  descricao: string;
  cor: string;
  consentimento: boolean;
  camposPadrao: {
    nome: boolean;
    faixaEtaria: boolean;
  };
  camposCustomizados?: CampoCustomizado[];
};
