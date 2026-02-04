export interface EmpresaForm {
  nome: string;
  descricao: string;
  cor: string;

  consentimento: boolean;

  camposPadrao: {
    nome: boolean;
    faixaEtaria: boolean;
  };

  camposCustomizados: {
    label: string;
    tipo: "objetiva" | "dissertativa";
    opcoes?: string;
  }[];
}
