import { TransformedRow } from './types';

export const finalHeaders: (keyof Omit<TransformedRow, 'Original ID'> & string)[] = [
    'Subscription ID',
    'Request Type',
    'VM Type',
    'Region',
    'Zone',
    'Cores',
    'Status'
];

export const NO_ZONE_REQUEST_TYPES = [
    // English
    "Quota Increase",
    "Quota Decrease",
    "Region Enablement",
    "Spot / Low Priority",
    "Region Limit Increase",
    "Reserved Instances",
    "RI Enablement/Whitelisting",
    "Region Enablement & Quota Increase",
    // Portuguese
    "Aumento de cota",
    "Redução de Cota",
    "Habilitação Regional",
    "Spot / Baixa prioridade",
    "Aumento de Limite Regional",
    "Instâncias reservadas",
    "Habilitação Regional e Aumento de Cota"
];

export const HIDE_CORES_REQUEST_TYPES = [
    "Zone",
    "Zona",
    "Zonal Enablement",
    "Habilitação Zonal"
];

export const DICTIONARY: Record<string, string> = {
    // Headers
    'Subscription ID': 'ID da Assinatura',
    'Request Type': 'Tipo de Requisição',
    'VM Type': 'Tipo de VM',
    'Region': 'Região',
    'Zone': 'Zona',
    'Cores': 'Núcleos',
    'Status': 'Status',
    'RDQuota': 'RDQuota',

    // Request Types
    'Zonal Enablement': 'Habilitação Zonal',
    'Region Enablement': 'Habilitação Regional',
    'Region Enablement & Quota Increase': 'Habilitação Regional & Aumento de Cota',
    'Quota Increase': 'Aumento de Cota',
    'Region Limit Increase': 'Aumento de Limite Regional',
    'Reserved Instances': 'Instâncias Reservadas',

    // Statuses
    'Approved': 'Aprovado',
    'Fulfilled': 'Atendido',
    'Backlogged': 'Pendente (Backlogged)',
    'Pending Customer Response': 'Aguardando Resposta do Cliente',
    'Pending': 'Pendente',

    // Common Values
    'N/A': 'N/A'
};
