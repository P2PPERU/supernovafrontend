// Re-exportar los hooks de afiliados desde useUsers para evitar duplicación
export {
  useAffiliateProfiles,
  useUpdateAffiliateProfile,
  useAffiliationHistory,
  useAgentClients,
  useTransferClient,
  useAffiliateStats,
  useAffiliateCodes,
  useCreateAffiliateCode,
  useUpdateAffiliateCode,
  useDeleteAffiliateCode
} from './useUsers';