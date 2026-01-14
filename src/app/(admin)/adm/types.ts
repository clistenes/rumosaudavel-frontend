export interface FormUser {
  nome: string;
  login: string;
  senha?: string | null;
}
export interface Usuario {
  id: number;
  nome: string;
  login: string;
  criacao: string;
  senha?: string;
}

export interface CreateUserForm {
  nome: string;
  login: string;
  senha: string;
}