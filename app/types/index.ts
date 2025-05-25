export type UserTypes = "colaborador" | "voluntario" | "parceiro" | "admin";

export interface User {
  id: string;
  nome: string;
  cpf: string;
  tipoUsuario: UserTypes;
  email: string;
  senha: string;
  movimentations: Movimentation[];
}

export interface Reward {
  id: string;
  nome: string;
  valor: number;
  idParceiro: string;
  unidadesRestantes: number;
}

export interface Mission {
  id: string;
  nome: string;
  descricao: string;
  localEntrega: string;
  valorReward: number;
  idParceiro: string;
}

export interface CollectPoint {
  id: string;
  nome: string;
  codigoVerificador: string;
  local: string;
}

export type MovimentationTypes =
  | "create-reward"
  | "create-mission"
  | "redeem-mission"
  | "redeem-points"
  | "redeem-reward"
  | "schedule-work"
  | "complete-mission"
  | "complete-work";

export interface Movimentation {
  id: string;
  type: MovimentationTypes;
  description: string;
}
