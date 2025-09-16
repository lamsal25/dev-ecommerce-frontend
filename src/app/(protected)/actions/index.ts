export type ActionResponse<T> = {
    data: T | null;
    msg?: string;
    error: string | null;
    status?: number;
  };