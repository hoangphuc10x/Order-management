declare namespace NodeJS {
    export interface ProcessEnv {
      TZ?: string;
      DATABASE_URI: string;
      URL_SERVER: string;
      PORT?: string;
    }
  }
