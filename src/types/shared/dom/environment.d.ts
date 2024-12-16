declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PROTOCOL: "http" | "https";
      API_HOST: string;
      API_PORT: string;
    }
  }
}

export {};
