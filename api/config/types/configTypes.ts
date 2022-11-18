export interface IStormGlassConfig {
  endpoint: string;
  apiKey: string;
  cacheTtl: number;
}

export interface IOpenMeteoConfig {
  endpoint: string;
  cacheTtl: number;
}

export interface IResourcesConfig {
  StormGlass: IStormGlassConfig;
  OpenMeteo: IOpenMeteoConfig;
}

export interface IAuth {
  seaccess_token_secret: string;
  refresh_token_secretcret: string;
}

export interface ICache {
  url: string;
  pass: string;
}

export interface IDatabaseConfig {
  url: string;
}

export interface ILoggerConfig {
  enabled: boolean;
  level: string;
}

export interface IEmailConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export interface IClientsConfig {
  web: string;
}

export interface IConfig {
  port: number;
  database: IDatabaseConfig;
  auth: IAuth;
  cache: ICache;
  email: IEmailConfig;
  clients: IClientsConfig;
  resources: IResourcesConfig;
  logger: ILoggerConfig;
}
