export interface CaseRecordDTO {
  id?: string;
  current?: number;
  size?: number;
  prisonerName?: string;
  prisonerNo?: string;
  policeName?: string;
  policeNo?: string;
  crimeType?: string;
  talkType?: string;
  status?: string;
  oortDepcode?: string;
  oortDepname?: string;
  startTime?: string;
  endTime?: string;
}

export interface CaseListResponse {
  records: Array<{
    id: string;
    recordNo: string;
    prisonerName: string;
    prisonerNo: string;
    policeName: string;
    policeNo: string;
    talkType: string;
    talkTypeName: string;
    talkTime: string;
    talkDuration: string;
    crimeType: string;
    crimeTypeName: string;
    status: string;
    statusDescription: string;
  }>;
  total: number;
  size: number;
  current: number;
} 