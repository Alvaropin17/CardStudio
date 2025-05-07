import { CsvDataset } from "./csv-dataset";

export interface CsvDatasetResponse {
    error: boolean;
    status: number;
    body: CsvDataset[];
}