export default interface ReviewSubmission {
  gameTitle: string;
  nickname: string;
  hoursPlayed: number;
  timestamp: number;
  review?: string;
  textDocument?: File | null;
  screenshots?: File[];
  videoReview?: File | null;
}
