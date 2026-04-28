export type AtlasBlockType =
  | 'text'
  | 'heading'
  | 'table'
  | 'stat'
  | 'statGroup'
  | 'list'
  | 'status'
  | 'link'
  | 'navigation'
  | 'chart'
  | 'callout'
  | 'divider';

export type StatusTone = 'on_track' | 'at_risk' | 'off_track';

export interface TextBlock { type: 'text'; content: string }
export interface HeadingBlock { type: 'heading'; content: string; level: 2 | 3 }
export interface TableBlock { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
export interface StatBlock { type: 'stat'; label: string; value: string; tone?: 'success' | 'warning' | 'danger' | 'neutral' }
export interface StatGroupBlock { type: 'statGroup'; stats: Array<{ label: string; value: string; tone?: string }> }
export interface ListBlock { type: 'list'; items: string[]; ordered?: boolean }
export interface StatusBlock { type: 'status'; label: string; status: StatusTone }
export interface LinkBlock { type: 'link'; href: string; label: string }
export interface NavigationBlock { type: 'navigation'; route: string; label: string }
export interface ChartBlock { type: 'chart'; chartType: 'bar' | 'line'; data: Array<{ name: string; value: number }>; title?: string }
export interface CalloutBlock { type: 'callout'; tone: 'info' | 'warning' | 'danger'; content: string }
export interface DividerBlock { type: 'divider' }

export type AtlasBlock =
  | TextBlock
  | HeadingBlock
  | TableBlock
  | StatBlock
  | StatGroupBlock
  | ListBlock
  | StatusBlock
  | LinkBlock
  | NavigationBlock
  | ChartBlock
  | CalloutBlock
  | DividerBlock;

export interface AtlasMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  blocks?: AtlasBlock[];
  toolsUsed?: string[];
  timestamp: number;
}

export interface AtlasChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentRoute: string;
  currentDate: string;
}

export interface AtlasChatResponse {
  content: string;
  blocks: AtlasBlock[];
  toolsUsed: string[];
}

export interface AtlasToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}
