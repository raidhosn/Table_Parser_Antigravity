import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { DataTable } from './DataTable';
import { ExcelExportButton } from './ExcelExportButton';
import { TranslateButton } from './TranslateButton';
import { CopyButton } from './CopyButton';
import { finalHeaders as defaultHeaders, DICTIONARY } from '../utils/constants';
import { cleanValue } from '../utils/parser';

import { getVisibleHeaders } from '../utils/visibility';

interface CategorySectionProps {
    categoryName: string;
    data: Record<string, any>[];
    headers?: string[];
    isTranslated: boolean;
    onToggleTranslation: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
    categoryName,
    data,
    headers = defaultHeaders,
    isTranslated,
    onToggleTranslation
}) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const visibleHeaders = useMemo(() => getVisibleHeaders(headers, data), [data, headers]);

    const displayHeaders = useMemo(() => visibleHeaders.map(h => isTranslated ? (DICTIONARY[h] || h) : h), [visibleHeaders, isTranslated]);

    const displayData = useMemo(() => data.map(row => {
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
            newRow[translatedKey] = cleanValue(val);
        });
        return newRow;
    }), [data, visibleHeaders, isTranslated]);

    const exportFilename = useMemo(() => {
        const cleanName = categoryName.replace(/\s+/g, '_');
        return isTranslated
            ? `${cleanName}_Dados_Cota_pt-BR.xlsx`
            : `${cleanName}_Quota_Data_en-US.xlsx`;
    }, [categoryName, isTranslated]);

    return (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div
                className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {categoryName}
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {data.length}
                        </span>
                    </h3>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <ExcelExportButton
                        headers={displayHeaders}
                        data={displayData}
                        filename={exportFilename}
                    />
                    <TranslateButton isTranslated={isTranslated} onToggle={onToggleTranslation} />
                    <CopyButton headers={visibleHeaders} data={data} />
                </div>
            </div>
            {isOpen && (
                <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                    <DataTable headers={displayHeaders} data={displayData} />
                </div>
            )}
        </div>
    );
};
