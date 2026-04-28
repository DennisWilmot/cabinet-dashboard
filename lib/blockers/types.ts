export type BlockerStatus = 'open' | 'in_progress' | 'resolved';
export type EscalationLevel = 'pm' | 'minister';

export interface ActivityEntry {
  id: string;
  type: 'comment' | 'status_change';
  author: string;
  content: string;
  timestamp: string;
  previousStatus?: BlockerStatus;
  newStatus?: BlockerStatus;
}

export interface Blocker {
  id: string;
  title: string;
  description: string;
  escalationLevel: EscalationLevel;
  assignedTo: string;
  assignedMinistrySlug: string;
  status: BlockerStatus;
  createdDate: string;
  linkedType?: 'project' | 'action_item';
  linkedName?: string;
  linkedHref?: string;
  activity: ActivityEntry[];
}
