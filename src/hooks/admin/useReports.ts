import { useMutation, useQuery } from "@tanstack/react-query";
import { ReportExportCsv, ReportExportPdf, ReportGet, type ReportsFetchProps } from "../../services/admin/reportService";

export const useReports = (
  params: ReportsFetchProps
) => {
  return useQuery({
    queryKey: ["admin-reports", params],
    queryFn: () => ReportGet(params),
  });
};



export const useReportExportCsv = () => {
  return useMutation({
    mutationFn: (params: ReportsFetchProps) =>
      ReportExportCsv(params),
  });
};


export const useReportExportPdf = () => {
  return useMutation({
    mutationFn: (params: ReportsFetchProps) =>
      ReportExportPdf(params),
  });
};