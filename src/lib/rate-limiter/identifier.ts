import { NextRequest } from "next/server";

export interface UserIdentity {
  id: string;
  type: "SESSION_ID" | "IP" | "FINGERPRINT";
}

export class UserIdentifier {
  /**
   * 로그인 기능이 없는 웹사이트 환경에 맞춰 사용자를 정밀하게 식별합니다.
   *
   * 1순위: 비로그인 세션 ID (쿠키의 session-id나 클라이언트 전송 헤더값)
   * 2순위: IP 주소 (네트워크 기반 최종 식별자)
   */
  public static identify(req: NextRequest): UserIdentity {
    // 1순위: 비로그인 세션 ID (쿠키 혹은 요청 헤더)
    const sessionId =
      req.cookies.get("session-id")?.value || req.headers.get("x-session-id");
    if (sessionId) {
      return { id: sessionId, type: "SESSION_ID" };
    }

    // 2순위: IP 주소 (Next.js 15 표준 스펙에 맞추어 헤더에서만 안전하게 파싱합니다)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    return { id: ip, type: "IP" };
  }
}
