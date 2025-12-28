import React from 'react';
import { cleanValue } from '../utils/parser';

interface DataTableProps {
    headers: string[];
    data: Record<string, any>[];
}

export const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
    return (
        <div className="overflow-hidden rounded-md border border-gray-300 shadow-sm bg-white w-auto inline-block min-w-full">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-[#D3D3D3]">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-4 py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap border border-gray-300"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 text-center border border-gray-300"
                                    >
                                        {cleanValue(row[header])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
