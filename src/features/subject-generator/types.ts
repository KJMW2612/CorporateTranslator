export type SubjectPurpose =
  | "없음"
  | "보고"
  | "요청"
  | "공유"
  | "협조"
  | "안내"
  | "긴급";
export type SubjectReceiver = "상사" | "동료" | "후배" | "거래처";

export interface SubjectRequest {
  keyword: string;
  purpose: SubjectPurpose;
  receiver: SubjectReceiver;
}

export interface SubjectResponse {
  direct: string; // 직관명료형 결과 제목
  polite: string; // 정중격식형 결과 제목
  deadline: string; // 기한강조형 결과 제목
}
