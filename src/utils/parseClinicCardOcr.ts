import type { Department } from '../types';

export interface ParsedClinicCard {
  clinicName?: string;
  patientId?: string;
  address?: string;
  department?: Department;
  businessHours?: string;
  closedDays?: string;
}

const DEPARTMENT_KEYWORDS: [RegExp, Department][] = [
  [/歯科|DENTAL/i, 'dental'],
  [/内科/, 'internal'],
  [/眼科/, 'ophthalmology'],
  [/皮膚科/, 'dermatology'],
  [/整形外科/, 'orthopedics'],
  [/耳鼻(?:咽喉)?科/, 'ent'],
  [/小児科/, 'pediatrics'],
  [/産婦人科|婦人科|産科/, 'obgyn'],
  [/心療内科|精神科|メンタル/, 'psychiatry'],
  [/泌尿器科/, 'urology'],
  [/接骨院|整骨院/, 'bonesetter'],
  [/鍼灸/, 'acupuncture'],
];

function extractClinicName(line: string): string | undefined {
  // 日本語の医院名パターン
  const jpMatch = line.match(
    /([\u4E00-\u9FFF\u30A0-\u30FF\u3040-\u309F\s]+(?:クリニック|医院|病院|診療所|歯科医院|歯科|接骨院|整骨院|鍼灸院))/
  );
  if (jpMatch) return jpMatch[1].trim();

  // 英語の医院名パターン (APPLE DENTAL CLINIC 等)
  const enMatch = line.match(
    /([A-Za-z][A-Za-z\s]+(?:CLINIC|HOSPITAL|DENTAL|MEDICAL|SURGERY|clinic|hospital|dental)s?)/i
  );
  if (enMatch) return enMatch[1].trim();

  return undefined;
}

function extractPatientId(line: string): string | undefined {
  // ラベル付きパターン: 患者番号: 12345, No. 12345, 診察券番号 12345
  const labeled = line.match(
    /(?:患者番号|患者ID|診察券番号|診察番号|受付番号|カルテ番号|No\.?|ID)[：:\s]*([A-Za-z0-9\-]+)/i
  );
  if (labeled) return labeled[1];

  return undefined;
}

// 全テキストから患者番号候補を探す（電話/FAX/郵便番号/時間を除外）
function extractPatientIdFromFullText(text: string): string | undefined {
  // まずラベル付きを試す
  const labeled = extractPatientId(text);
  if (labeled) return labeled;

  // 電話番号・FAX・郵便番号・時刻を除外したテキストを作る
  const cleaned = text
    .replace(/(?:TEL|FAX|tel|fax|電話|☎|℡)[：:\s]*\d[\d\-ー]+/gi, '') // TEL/FAX
    .replace(/〒?\s*\d{3}[-ー]\d{4}/g, '')                              // 郵便番号
    .replace(/0\d{1,3}[-ー]\d{2,4}[-ー]\d{3,4}/g, '')                   // 電話番号形式
    .replace(/\d{1,2}[:：]\d{2}/g, '');                                  // 時刻

  // 残った数字列から患者番号候補を探す（3桁以上の数字）
  const candidates = [...cleaned.matchAll(/\b(\d{3,8})\b/g)];
  if (candidates.length === 1) {
    // 候補が1つだけなら高確率で患者番号
    return candidates[0][1];
  }

  return undefined;
}


function extractAddress(line: string): string | undefined {
  // 〒付き
  const zipMatch = line.match(/〒?\s*(\d{3}[-ー]\d{4})\s*(.*)/);
  if (zipMatch && zipMatch[2]) return `〒${zipMatch[1]} ${zipMatch[2]}`.trim();

  // 都道府県から始まるパターン
  const addrMatch = line.match(
    /((?:東京都|北海道|(?:京都|大阪)府|.{2,3}県).{3,})/
  );
  if (addrMatch) return addrMatch[1].trim();

  // ○○市、○○区、○○町
  const cityMatch = line.match(
    /([\u4E00-\u9FFF]+(?:市|区|町|村)[\u4E00-\u9FFF\d\-ー]+)/
  );
  if (cityMatch && cityMatch[1].length > 4) return cityMatch[1];

  return undefined;
}

function extractDepartment(line: string): Department | undefined {
  for (const [pattern, dept] of DEPARTMENT_KEYWORDS) {
    if (pattern.test(line)) return dept;
  }
  return undefined;
}

function extractBusinessHours(line: string): string | undefined {
  // 時間パターン: 9:00〜12:00, 14:00-18:00, 09:00 -〜13:30 等
  // 区切り文字が複数連続するケース（ -〜 等）にも対応
  const timePattern = /(\d{1,2}[:：]\d{2})\s*[\s〜~ー\-－]+\s*(\d{1,2}[:：]\d{2})/g;
  const matches = [...line.matchAll(timePattern)];
  if (matches.length > 0) {
    return matches
      .map((m) => `${m[1].replace('：', ':')}〜${m[2].replace('：', ':')}`)
      .join(' / ');
  }

  // 午前・午後パターン
  if (/(?:午前|午後|診療時間|受付時間|診察時間)/.test(line)) {
    const cleaned = line
      .replace(/^(?:診療時間|受付時間|診察時間)[：:\s]*/u, '')
      .trim();
    if (cleaned.length > 2) return cleaned;
  }

  return undefined;
}

function extractClosedDays(line: string): string | undefined {
  const match = line.match(
    /(?:休診日?|定休日?|休業日?|お休み)[：:\s]*(.*)/u
  );
  if (match && match[1].trim()) return match[1].trim();

  // 曜日の列挙パターン: 木・日・祝
  const dayPattern = line.match(
    /([月火水木金土日](?:[曜・,、\s]+[月火水木金土日])*(?:曜日?)?(?:[・,、\s]*祝(?:日)?)?)\s*(?:休診|休み|定休)/
  );
  if (dayPattern) return dayPattern[1];

  return undefined;
}

export function parseClinicCardFromOcr(rawText: string): ParsedClinicCard {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const result: ParsedClinicCard = {};

  // 全テキストを結合して検索（OCRが改行位置をずらすことがある）
  const fullText = rawText.replace(/\n/g, ' ');

  for (const line of lines) {
    if (!result.clinicName) {
      result.clinicName = extractClinicName(line);
    }
    if (!result.patientId) {
      result.patientId = extractPatientId(line);
    }
    if (!result.address) {
      result.address = extractAddress(line);
    }
    if (!result.department) {
      result.department = extractDepartment(line);
    }
    if (!result.closedDays) {
      result.closedDays = extractClosedDays(line);
    }
  }

  // 行単位で見つからなかった場合、全テキスト結合で再検索
  if (!result.clinicName) {
    result.clinicName = extractClinicName(fullText);
  }
  if (!result.patientId) {
    result.patientId = extractPatientIdFromFullText(fullText);
  }
  // 診療時間は常に全テキストから検索（行分割で午前/午後が別になるため）
  result.businessHours = extractBusinessHours(fullText);

  // 医院名から診療科を推定
  if (!result.department && result.clinicName) {
    result.department = extractDepartment(result.clinicName);
  }

  return result;
}
