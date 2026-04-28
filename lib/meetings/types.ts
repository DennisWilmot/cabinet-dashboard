export type MeetingStatus = 'completed' | 'upcoming' | 'in_progress';
export type TranscriptStatus = 'uploaded' | 'not_uploaded';
export type ActionItemStatus = 'pending' | 'in_progress' | 'completed';

export interface MeetingAttendee {
  name: string;
  title: string;
  avatarUrl: string;
  ministrySlug: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  ministrySlug: string;
  dueDate: string;
  status: ActionItemStatus;
}

export interface KeyDecision {
  id: string;
  decision: string;
  proposedBy: string;
  category: string;
}

export interface CabinetMeeting {
  id: string;
  date: string;
  title: string;
  meetLink: string;
  status: MeetingStatus;
  transcriptStatus: TranscriptStatus;
  transcriptUrl?: string;
  attendees: MeetingAttendee[];
  actionItems?: ActionItem[];
  keyDecisions?: KeyDecision[];
  minutes?: string;
  rawTranscript?: string;
}
