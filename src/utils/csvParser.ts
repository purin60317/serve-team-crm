import { MemberRecord } from '../types';

/**
 * Parses raw CSV content into MemberRecord array
 * Handles common CSV anomalies and Chinese headers
 */
export function parseCSV(csvText: string): MemberRecord[] {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Parse headers
  const headers = parseCSVLine(lines[0]);
  
  // Find indices for each field (using substrings to tolerate differences in spacing)
  const phoneIdx = headers.findIndex(h => h.includes('手機驗證') || h.includes('phoneVerified'));
  const groupIdx = headers.findIndex(h => h.includes('已有小組') || h.includes('hasGroup'));
  const teamIdx = headers.findIndex(h => h.includes('已有服事') || h.includes('hasTeam'));
  const teamCountIdx = headers.findIndex(h => h.includes('團隊人數') || h.includes('teamCount'));
  const b1Idx = headers.findIndex(h => h.includes('B1') || h.includes('b1'));
  const b2Idx = headers.findIndex(h => h.includes('B2') || h.includes('b2'));
  const b3Idx = headers.findIndex(h => h.includes('B3') || h.includes('b3'));
  const campusIdx = headers.findIndex(h => h.includes('Campus') || h.includes('分部') || h.includes('campus'));
  const teamNameIdx = headers.findIndex(h => h.includes('團隊(英文)') || h.includes('team') && !h.includes('sub'));
  const subTeamIdx = headers.findIndex(h => h.includes('子團隊') || h.includes('subTeam'));

  const records: MemberRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    if (values.length < 3) continue; // Skip invalid lines

    // Helper to parse booleans ("1" or "true" is true)
    const parseBool = (val: string): boolean => {
      const v = val.trim().replace(/^["']|["']$/g, '');
      return v === '1' || v.toLowerCase() === 'true';
    };

    const parseNum = (val: string, fallback = 0): number => {
      const v = val.trim().replace(/^["']|["']$/g, '');
      const parsed = parseInt(v, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    const cleanStr = (val: string): string => {
      if (!val) return '';
      return val.trim().replace(/^["']|["']$/g, '');
    };

    const record: MemberRecord = {
      id: `mem-${i}-${Math.random().toString(36).substr(2, 9)}`,
      phoneVerified: phoneIdx !== -1 && values[phoneIdx] ? parseBool(values[phoneIdx]) : false,
      hasGroup: groupIdx !== -1 && values[groupIdx] ? parseBool(values[groupIdx]) : false,
      hasTeam: teamIdx !== -1 && values[teamIdx] ? parseBool(values[teamIdx]) : true,
      teamCount: teamCountIdx !== -1 && values[teamCountIdx] ? parseNum(values[teamCountIdx], 10) : 10,
      b1: b1Idx !== -1 && values[b1Idx] ? parseBool(values[b1Idx]) : false,
      b2: b2Idx !== -1 && values[b2Idx] ? parseBool(values[b2Idx]) : false,
      b3: b3Idx !== -1 && values[b3Idx] ? parseBool(values[b3Idx]) : false,
      campus: campusIdx !== -1 && values[campusIdx] ? cleanStr(values[campusIdx]) : '未知分部',
      team: teamNameIdx !== -1 && values[teamNameIdx] ? cleanStr(values[teamNameIdx]) : 'General',
      subTeam: subTeamIdx !== -1 && values[subTeamIdx] ? cleanStr(values[subTeamIdx]) : '',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    records.push(record);
  }

  return records;
}

/**
 * Parses a single CSV line, handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  // Clean trailing and leading quotes of each item
  return result.map(val => val.replace(/^["']|["']$/g, ''));
}

/**
 * Generates CSV string from MemberRecord array
 */
export function generateCSV(records: MemberRecord[]): string {
  const headers = [
    '"會眾資料: 手機驗證通過"',
    '"會眾資料: 已有小組"',
    '"會眾資料: 已有服事團隊"',
    '"服事團隊資料: 團隊人數計算"',
    '"會眾資料: 會眾身份[服事] B1 人數"',
    '"會眾資料: 會眾身份[服事] B2 人數"',
    '"會眾資料: 會眾身份[服事] B3 人數"',
    '"團隊所屬Campus"',
    '"團隊(英文)"',
    '"子團隊(英文)"'
  ];

  const lines = [headers.join(',')];

  records.forEach(r => {
    const row = [
      r.phoneVerified ? '"1"' : '"0"',
      r.hasGroup ? '"1"' : '"0"',
      r.hasTeam ? '"1"' : '"0"',
      `"${r.teamCount}"`,
      r.b1 ? '"1"' : '"0"',
      r.b2 ? '"1"' : '"0"',
      r.b3 ? '"1"' : '"0"',
      `"${r.campus}"`,
      `"${r.team}"`,
      `"${r.subTeam || ''}"`
    ];
    lines.push(row.join(','));
  });

  return lines.join('\n');
}
