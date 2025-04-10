// Нарочно е така, за да пробвам интергейси, json обекти и рекорди
export interface AppSettings {
  baseUrls: Record<ApiService, string>;
}

export enum ApiService {
  BaseApiUrl = "baseApiUrl",
  BaseUiUrl = "baseUiUrl",
}