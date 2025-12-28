export interface CurrentUserData {
    id: string;
    email: string;
    nome: string;
    cognome: string;
    ruolo: string;
    clienteId: string | null;
    studioId: string | null;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
