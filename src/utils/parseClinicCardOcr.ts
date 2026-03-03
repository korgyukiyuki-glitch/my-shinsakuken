import type { Department } from '../types';

export interface ParsedClinicCard {
  clinicName?: string;
  patientId?: string;
  phone?: string;
  address?: string;
  department?: Department;
  businessHours?: string;
  closedDays?: string;
}

const DEPARTMENT_KEYWORDS: [RegExp, Department][] = [
  [/歯科/, 'dental'],
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
  const match = line.match(
    /([\u4E00-\u9FFF\u30A0-\u30FF\u3040-\u309F\s]+(?:クリニック|医院|病院|診療所|歯科医院|歯科|接骨院|整骨院|鍼灸院))/
  );
  if (match) return match[1].trim();
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

function extractPhone(line: string): string | undefined {
  const match = line.match(
    /(?:TEL|Tel|tel|電話|☎|℡)[：:\s]*(\d{2,4}[-ー]\d{2,4}[-ー]\d{3,4})/
  );
  if (match) return match[1].replace(/ー/g, '-');

  // 電話番号パターン（ラベルなし）
  const phoneOnly = line.match(/\b(0\d{1,3}[-ー]\d{2,4}[-ー]\d{3,4})\b/);
  if (phoneOnly) return phoneOnly[1].replace(/ー/g, '-');

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
  // 時間パターン: 9:00〜12:00, 14:00-18:00 等
  const timePattern = /(\d{1,2}[:：]\d{2})\s*[〜~ー\-－]\s*(\d{1,2}[:：]\d{2})/g;
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

  for (const line of lines) {
    if (!result.clinicName) {
      result.clinicName = extractClinicName(line);
    }
    if (!result.patientId) {
      result.patientId = extractPatientId(line);
    }
    if (!result.phone) {
      result.phone = extractPhone(line);
    }
    if (!result.address) {
      result.address = extractAddress(line);
    }
    if (!result.department) {
      result.department = extractDepartment(line);
    }
    if (!result.businessHours) {
      result.businessHours = extractBusinessHours(line);
    }
    if (!result.closedDays) {
      result.closedDays = extractClosedDays(line);
    }
  }

  // 医院名から診療科を推定
  if (!result.department && result.clinicName) {
    result.department = extractDepartment(result.clinicName);
  }

  return result;
}
