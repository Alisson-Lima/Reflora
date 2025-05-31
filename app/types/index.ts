export type UserTypes = "colaborador" | "voluntario" | "parceiro" | "admin";

export interface User {
  id: string;
  points: number;
  nome: string;
  cpf: string;
  tipoUsuario: UserTypes;
  email: string;
  senha: string;
  movimentations: Movimentation[];
  missions?: Mission[];
  jobs?: Job[];
  createdAt: string;
}

export interface Job {
  id: string;
  nome: string;
  descricao: string;
  dataJob: string;
  local: string;
  points: number;
  codigoVerificador: string;
  status: "pending" | "completed" | "canceled";
}

export interface CollectAreaType {
  id: string;
  nome: string;
  codigoVerificador: string;
  local: string;
  descricao?: string;
  points: number;
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
