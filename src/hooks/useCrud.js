import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useCrudList(key, apiFn, params = {}) {
  return useQuery({
    queryKey: [key, params],
    queryFn: () => apiFn(params).then((r) => r.data),
    keepPreviousData: true,
  });
}

export function useCrudDetail(key, apiFn, id) {
  return useQuery({
    queryKey: [key, id],
    queryFn: () => apiFn(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCrudCreate(key, apiFn, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      qc.invalidateQueries([key]);
      toast.success(options.successMsg || 'تم الإنشاء بنجاح');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'حدث خطأ'),
  });
}

export function useCrudUpdate(key, apiFn, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiFn(id, data),
    onSuccess: () => {
      qc.invalidateQueries([key]);
      toast.success(options.successMsg || 'تم التحديث بنجاح');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'حدث خطأ'),
  });
}

export function useCrudDelete(key, apiFn, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      qc.invalidateQueries([key]);
      toast.success(options.successMsg || 'تم الحذف بنجاح');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'حدث خطأ'),
  });
}
