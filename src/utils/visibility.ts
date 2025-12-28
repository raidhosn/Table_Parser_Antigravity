/**
 * Checks if a table (list of rows) should hide certain columns based on its Request Type(s).
 */
export const getVisibleHeaders = (headers: string[], _data: Record<string, any>[]): string[] => {
    // Enterprise Spec Tightening: Always return full headers to maintain a consistent grid.
    // Value masking (N/A) is now handled at the cell level in components.
    return headers;
};
