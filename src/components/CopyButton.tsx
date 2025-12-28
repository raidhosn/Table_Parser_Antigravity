import React, { useState, useCallback } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { cleanValue } from '../utils/parser';

interface CopyButtonProps {
    headers: string[];
    data: Record<string, any>[];
}

export const CopyButton: React.FC<CopyButtonProps> = ({ headers, data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        // Create TSV content
        const headerRow = headers.join('\t');
        const dataRows = data.map(row => {
            return headers.map(header => {
                const val = row[header];
                return cleanValue(val);
            }).join('\t');
        }).join('\n');

        const tsvContent = `${headerRow}\n${dataRows}`;

        // Create Word-optimized HTML content
        const htmlTable = `
            <html>
            <head>
                <style>
                    table { border-collapse: collapse; width: auto; table-layout: auto; border: 1px solid #000000; font-family: Calibri, Arial, sans-serif; background-color: #ffffff; }
                    th { background-color: #D3D3D3; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 10px; text-transform: uppercase; font-size: 10pt; text-align: center; }
                    td { border: 1px solid #000000; padding: 6px 10px; color: #000000; font-size: 10pt; text-align: center; }
                </style>
            </head>
            <body>
            <!--StartFragment-->
            <table>
                <thead>
                    <tr>
                        ${headers.map(h => `<th scope="col">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${headers.map(h => `<td>${cleanValue(row[h])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <!--EndFragment-->
            </body>
            </html>
        `;

        try {
            // Priority 1: Modern Clipboard API with multi-MIME support
            if (navigator.clipboard && navigator.clipboard.write) {
                const clipboardItem = new ClipboardItem({
                    "text/plain": new Blob([tsvContent], { type: "text/plain" }),
                    "text/html": new Blob([htmlTable], { type: "text/html" })
                });
                await navigator.clipboard.write([clipboardItem]);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Fallback for Safari/Legacy browsers
                throw new Error("Modern clipboard write not available");
            }
        } catch (err) {
            console.warn('Modern clipboard API failed, trying fallback...', err);

            // Fallback: Using execCommand('copy') with 'copy' event listener
            const listener = (e: ClipboardEvent) => {
                e.preventDefault();
                if (e.clipboardData) {
                    e.clipboardData.setData('text/html', htmlTable);
                    e.clipboardData.setData('text/plain', tsvContent);
                }
            };

            document.addEventListener('copy', listener);
            const success = document.execCommand('copy');
            document.removeEventListener('copy', listener);

            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                console.error('All copy methods failed');
            }
        }
    }, [headers, data]);

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${copied
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
            title="Copy to Clipboard (Excel compatible)"
        >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};
