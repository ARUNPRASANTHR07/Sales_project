// GridTypes.ts
export interface GridRow {
    id: number | string;
    [key: string]: any;
}

export type ColumnType = "label" | "text" | "number" | "combo" | "date";

export interface GridColumn {
    key: string;
    label: string;
    type?: ColumnType;
    width?: string;
    editable?: boolean;
    options?:
    | { label: string; value: any }[]
    | ((row: GridRow) => { label: string; value: any }[]);
    ismandatory?: boolean;
    popupedit?: boolean;
    popuptype?: ColumnType;
    isMulti?: boolean;
}
