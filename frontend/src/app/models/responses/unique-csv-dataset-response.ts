import { CsvDataset } from "../csv-dataset";

export interface UniqueCsvDatasetResponse {
    error: boolean;
    status: number;
    body: CsvDataset;
}