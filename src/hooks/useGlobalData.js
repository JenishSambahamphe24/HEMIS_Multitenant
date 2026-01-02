import { useQuery } from '@tanstack/react-query'
import { getAllProgramsWithMajorSubs, getAllYears, getBatch, getCollegePrograms, getFiscalYear } from '../services/services';


export const useBatches = () => {
    return useQuery({
        queryKey: ['batches'],
        queryFn: getBatch,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}

export const useFiscals = () => {
    return useQuery({
        queryKey: ['fiscalYears'],
        queryFn: getFiscalYear,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}

export const useAnnualData = () => {
    return useQuery({
        queryKey: ['years'],
        queryFn: getAllYears,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}

export const useSemesterData = () => {
    return useQuery({
        queryKey: ['semesters'],
        queryFn: getAllYears,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}

export const usePrograms = () => {
    return useQuery({
        queryKey: ['programs'],
        queryFn: getAllProgramsWithMajorSubs,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })
}