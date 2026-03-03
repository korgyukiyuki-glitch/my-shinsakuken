export interface ParsedMedication {
  date?: string;
  medicineName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  prescribedBy?: string;
  clinicName?: string;
}

function extractDate(line: string): string | undefined {
  // 令和X年X月X日
  const reiwMatch = line.match(/令和(\d{1,2})年(\d{1,2})月(\d{1,2})日/);
  if (reiwMatch) {
    const year = 2018 + parseInt(reiwMatch[1], 10);
    const month = reiwMatch[2].padStart(2, '0');
    const day = reiwMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // R6.3.1 or R6/3/1
  const reiwShortMatch = line.match(/R(\d{1,2})[./](\d{1,2})[./](\d{1,2})/);
  if (reiwShortMatch) {
    const year = 2018 + parseInt(reiwShortMatch[1], 10);
    const month = reiwShortMatch[2].padStart(2, '0');
    const day = reiwShortMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 2026年3月1日 or 2026/03/01 or 2026-03-01
  const westernMatch = line.match(/(\d{4})[年/\-.](\d{1,2})[月/\-.](\d{1,2})日?/);
  if (westernMatch) {
    const month = westernMatch[2].padStart(2, '0');
    const day = westernMatch[3].padStart(2, '0');
    return `${westernMatch[1]}-${month}-${day}`;
  }

  return undefined;
}

function extractMedicineName(line: string): string | undefined {
  // 薬品名を含む行: 錠, カプセル, mg, μg, mL, 散, 顆粒, 液, シロップ, 軟膏, クリーム, テープ, パップ
  if (/(?:錠|カプセル|mg|μg|mL|散|顆粒|液|シロップ|軟膏|クリーム|テープ|パップ|坐剤|点眼|吸入)/i.test(line)) {
    // ラベル部分を除去
    const cleaned = line
      .replace(/^(?:薬品名|薬剤名|処方薬|医薬品名)[：:\s]*/u, '')
      .trim();
    if (cleaned.length > 1) return cleaned;
  }
  return undefined;
}

function extractFrequency(line: string): string | undefined {
  // 1日X回 + 服用タイミング
  const freqMatch = line.match(
    /1日(\d)回\s*(?:毎食後|毎食前|朝食後|昼食後|夕食後|朝夕食後|朝昼夕食後|食前|食後|食間|就寝前|起床時)?/
  );
  if (freqMatch) return freqMatch[0].trim();

  // 服用タイミングのみ
  const timingMatch = line.match(
    /(?:毎食後|毎食前|朝食後|昼食後|夕食後|朝夕食後|朝昼夕食後|食前|食後|食間|就寝前|起床時|頓服)/
  );
  if (timingMatch) return timingMatch[0];

  return undefined;
}

function extractDuration(line: string): string | undefined {
  const match = line.match(/(\d+)\s*日分/);
  if (match) return `${match[1]}日分`;
  return undefined;
}

function extractDosage(line: string): string | undefined {
  // 1回X錠, X錠, Xカプセル, X包, Xg
  const match = line.match(
    /(?:1回\s*)?(\d+(?:\.\d+)?)\s*(錠|カプセル|包|g|mL|滴|吸入|噴霧|枚)/
  );
  if (match) return `${match[1]}${match[2]}`;
  return undefined;
}

function extractPrescriber(line: string): string | undefined {
  const match = line.match(/(?:処方医|医師|担当医)[：:\s]*(.+)/u);
  if (match) return match[1].trim();

  // X先生パターン
  const sensei = line.match(/([\u4E00-\u9FFF]{1,4})\s*先生/);
  if (sensei) return `${sensei[1]}先生`;

  return undefined;
}

function extractClinicName(line: string): string | undefined {
  const match = line.match(
    /([\u4E00-\u9FFF\u30A0-\u30FF\u3040-\u309F]+(?:クリニック|医院|病院|診療所|歯科|薬局))/
  );
  if (match) return match[1];
  return undefined;
}

export function parseMedicationFromOcr(rawText: string): ParsedMedication {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const result: ParsedMedication = {};

  for (const line of lines) {
    if (!result.date) {
      result.date = extractDate(line);
    }
    if (!result.medicineName) {
      result.medicineName = extractMedicineName(line);
    }
    if (!result.frequency) {
      result.frequency = extractFrequency(line);
    }
    if (!result.duration) {
      result.duration = extractDuration(line);
    }
    if (!result.dosage) {
      result.dosage = extractDosage(line);
    }
    if (!result.prescribedBy) {
      result.prescribedBy = extractPrescriber(line);
    }
    if (!result.clinicName) {
      result.clinicName = extractClinicName(line);
    }
  }

  return result;
}
