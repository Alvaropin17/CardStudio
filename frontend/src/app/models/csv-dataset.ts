export interface CsvDataset {
    id?: number;
    user_id?: number;
    name: string;
    headers: string[];
    data: Array<{       
        [key: string]: string;
    }>;
}
