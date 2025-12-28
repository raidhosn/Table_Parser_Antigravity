import React, { useMemo } from 'react';
import { FileType, FileSpreadsheet } from 'lucide-react';
import { CategorySection } from './CategorySection';
import { DataTable } from './DataTable';
import { ExcelExportButton } from './ExcelExportButton';
import { TranslateButton } from './TranslateButton';
import { CopyButton } from './CopyButton';
import { TransformedRow } from '../utils/types';
import { DICTIONARY } from '../utils/constants';
import { cleanValue } from '../utils/parser';

import { getVisibleHeaders } from '../utils/visibility';

interface ResultsViewProps {
    transformedData: TransformedRow[];
    categorizedData: Record<string, TransformedRow[]>;
    finalHeaders: string[];
    isTranslated: boolean;
    setIsTranslated: (val: boolean) => void;
}

export const CategorizedResultsView: React.FC<ResultsViewProps> = ({
    transformedData,
    categorizedData,
    finalHeaders,
    isTranslated,
    setIsTranslated
}) => {
    // Absolute Purge: Filter out "Unknown" rows and invalid data at the source
    const filteredRows = useMemo(() => transformedData.filter(row => {
        const type = (row['Request Type'] || '').trim();
        if (type === 'Unknown' || type === 'Desconhecido') return false;

        // Data Integrity: Must have Sub ID or (VM Type AND Region)
        const hasSubId = !!row['Subscription ID'];
        const hasVmType = !!row['VM Type'] && row['VM Type'] !== 'N/A';
        const hasRegion = !!row['Region'] && row['Region'] !== 'N/A';

        return hasSubId || (hasVmType && hasRegion);
    }), [transformedData]);

    const visibleHeaders = useMemo(() => getVisibleHeaders(finalHeaders, filteredRows), [finalHeaders, filteredRows]);
    const displayHeaders = useMemo(() => visibleHeaders.map(h => isTranslated ? (DICTIONARY[h] || h) : h), [visibleHeaders, isTranslated]);

    const displayData = useMemo(() => {
        return filteredRows.map(row => {
            const newRow: Record<string, any> = { 'Original ID': row['Original ID'] };
            const requestType = (row['Request Type'] || '').trim();
            const isZonal = requestType === 'Zonal Enablement' || requestType === 'Habilitação Zonal';

            visibleHeaders.forEach(h => {
                const translatedKey = isTranslated ? (DICTIONARY[h] || h) : h;
                let val = (row as any)[h];

                // Value Masking Rules
                if (h === 'Cores' && isZonal) {
                    val = 'N/A';
                } else if (h === 'Zone' && !isZonal) {
                    val = 'N/A';
                }

                if (isTranslated) {
                    val = DICTIONARY[val] || val;
                }

                // Value Hygiene: No "Unknown" cells
                if (val === 'Unknown' || val === 'Desconhecido') {
                    val = '';
                }

                newRow[translatedKey] = cleanValue(val);
            });
            return newRow;
        });
    }, [filteredRows, visibleHeaders, isTranslated]);

    const sectionTitle = isTranslated ? DICTIONARY['Unified Table'] : 'Unified Table';
    const mainTitle = isTranslated ? DICTIONARY['Categorized Results'] : 'Categorized Results';

    const exportFilename = useMemo(() => {
        return isTranslated
            ? "Tabela_Unificada_pt-BR.xlsx"
            : "Unified_Table_en-US.xlsx";
    }, [isTranslated]);

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-3xl font-bold text-blue-600">{filteredRows.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                        {isTranslated ? 'Total de Linhas' : 'Total Rows'}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-3xl font-bold text-purple-600">
                        {Object.keys(categorizedData).filter(c => c !== 'Unknown' && c !== 'Desconhecido').length}
                    </p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                        {isTranslated ? 'Categorias' : 'Categories'}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-3xl font-bold text-emerald-600">{visibleHeaders.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                        {isTranslated ? 'Colunas' : 'Columns'}
                    </p>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FileType className="mr-2 h-6 w-6 text-gray-600" />
                    {mainTitle}
                </h2>
                {Object.entries(categorizedData)
                    .filter(([category]) => category !== 'Unknown' && category !== 'Desconhecido')
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, data]) => (
                        <CategorySection
                            key={category}
                            categoryName={category}
                            data={data}
                            headers={finalHeaders}
                            isTranslated={isTranslated}
                            onToggleTranslation={() => setIsTranslated(!isTranslated)}
                        />
                    ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ExcelExportButton headers={displayHeaders} data={displayData} filename={exportFilename} />
                        <TranslateButton isTranslated={isTranslated} onToggle={() => setIsTranslated(!isTranslated)} />
                        <CopyButton headers={displayHeaders} data={displayData} />
                    </div>
                </div>
                <DataTable headers={displayHeaders} data={displayData} />
            </div>
        </div>
    );
};

export const UnifiedResultsView: React.FC<ResultsViewProps> = ({
    transformedData,
    categorizedData,
    finalHeaders,
    isTranslated,
    setIsTranslated
}) => {
    const headersWithRdQuota = useMemo(() => ['RDQuota', ...finalHeaders], [finalHeaders]);
    const unifiedDataWithRdQuota = useMemo(() => transformedData.map(row => ({ ...row, RDQuota: row['Original ID'] })), [transformedData]);

    // Absolute Purge: Filter out "Unknown" rows and invalid data at the source
    const filteredRows = useMemo(() => unifiedDataWithRdQuota.filter(row => {
        const type = (row['Request Type'] || '').trim();
        if (type === 'Unknown' || type === 'Desconhecido') return false;

        const hasSubId = !!row['Subscription ID'];
        const hasVmType = !!row['VM Type'] && row['VM Type'] !== 'N/A';
        const hasRegion = !!row['Region'] && row['Region'] !== 'N/A';

        return hasSubId || (hasVmType && hasRegion);
    }), [unifiedDataWithRdQuota]);

    const visibleHeaders = useMemo(() => getVisibleHeaders(headersWithRdQuota, filteredRows), [headersWithRdQuota, filteredRows]);
    const displayHeaders = useMemo(() => visibleHeaders.map(h => isTranslated ? (DICTIONARY[h] || h) : h), [visibleHeaders, isTranslated]);

    const displayData = useMemo(() => {
        return filteredRows.map(row => {
            const newRow: Record<string, any> = { 'Original ID': row['Original ID'] };
            const requestType = (row['Request Type'] || '').trim();
            const isZonal = requestType === 'Zonal Enablement' || requestType === 'Habilitação Zonal';

            visibleHeaders.forEach(h => {
                const translatedKey = isTranslated ? (DICTIONARY[h] || h) : h;
                let val = (row as any)[h];

                // Value Masking Rules
                if (h === 'Cores' && isZonal) {
                    val = 'N/A';
                } else if (h === 'Zone' && !isZonal) {
                    val = 'N/A';
                }

                if (isTranslated) {
                    val = DICTIONARY[val] || val;
                }

                // Value Hygiene: No "Unknown" cells
                if (val === 'Unknown' || val === 'Desconhecido') {
                    val = '';
                }

                newRow[translatedKey] = cleanValue(val);
            });
            return newRow;
        });
    }, [filteredRows, visibleHeaders, isTranslated]);

    const sectionTitle = isTranslated ? `${DICTIONARY['Unified Table']} (${DICTIONARY['RDQuota']})` : 'Unified Table (with IDs)';
    const mainTitle = isTranslated ? DICTIONARY['RDQuotas Categorized'] : 'RDQuotas Categorized';

    const exportFilename = useMemo(() => {
        return isTranslated
            ? "Tabela_Unificada_por_RDQuota_pt-BR.xlsx"
            : "Unified_Table_by_RDQuota_en-US.xlsx";
    }, [isTranslated]);

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-3xl font-bold text-blue-600">{filteredRows.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                        {isTranslated ? 'Total de Linhas' : 'Total Rows'}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-3xl font-bold text-purple-600">
                        {Object.keys(categorizedData).filter(c => c !== 'Unknown' && c !== 'Desconhecido').length}
                    </p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                        {isTranslated ? 'Categorias' : 'Categories'}
                    </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
                    <p className="text-3xl font-bold text-emerald-600">{visibleHeaders.length}</p>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">
                        {isTranslated ? 'Colunas' : 'Columns'}
                    </p>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FileType className="mr-2 h-6 w-6 text-gray-600" />
                    {mainTitle}
                </h2>
                {Object.entries(categorizedData)
                    .filter(([category]) => category !== 'Unknown' && category !== 'Desconhecido')
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, data]) => (
                        <CategorySection
                            key={category}
                            categoryName={category}
                            data={data.map(row => ({ ...row, RDQuota: row['Original ID'] }))}
                            headers={headersWithRdQuota}
                            isTranslated={isTranslated}
                            onToggleTranslation={() => setIsTranslated(!isTranslated)}
                        />
                    ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ExcelExportButton headers={displayHeaders} data={displayData} filename={exportFilename} />
                        <TranslateButton isTranslated={isTranslated} onToggle={() => setIsTranslated(!isTranslated)} />
                        <CopyButton headers={displayHeaders} data={displayData} />
                    </div>
                </div>
                <DataTable headers={displayHeaders} data={displayData} />
            </div>
        </div>
    );
};
