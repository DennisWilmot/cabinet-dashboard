import type { MinistryData } from '@/lib/types';
import { mofData } from './ministries/mof';
import { educationData } from './ministries/education';
import { healthData } from './ministries/health';
import { nationalSecurityData } from './ministries/national-security';
import { opmData } from './ministries/opm';
import { cabinetData } from './ministries/cabinet';
import { tourismData } from './ministries/tourism';
import { economicGrowthData } from './ministries/economic-growth';
import { waterData } from './ministries/water';
import { justiceData } from './ministries/justice';
import { foreignAffairsData } from './ministries/foreign-affairs';
import { labourData } from './ministries/labour';
import { cultureData } from './ministries/culture';
import { agricultureData } from './ministries/agriculture';
import { industryData } from './ministries/industry';
import { energyTransportData } from './ministries/energy-transport';
import { localGovtData } from './ministries/local-govt';

export const ministryRegistry: Record<string, MinistryData> = {
  opm: opmData,
  mof: mofData,
  education: educationData,
  health: healthData,
  'national-security': nationalSecurityData,
  'energy-transport': energyTransportData,
  'local-govt': localGovtData,
  labour: labourData,
  'economic-growth': economicGrowthData,
  justice: justiceData,
  tourism: tourismData,
  agriculture: agricultureData,
  'foreign-affairs': foreignAffairsData,
  industry: industryData,
  culture: cultureData,
  water: waterData,
  cabinet: cabinetData,
};

export const ministryOrder: string[] = [
  'opm',
  'mof',
  'education',
  'health',
  'national-security',
  'energy-transport',
  'local-govt',
  'labour',
  'economic-growth',
  'justice',
  'tourism',
  'agriculture',
  'foreign-affairs',
  'industry',
  'culture',
  'water',
  'cabinet',
];

export function getMinistryData(slug: string): MinistryData | undefined {
  return ministryRegistry[slug];
}

export function getAllMinistrySlugs(): string[] {
  return ministryOrder;
}
