import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const meetingAttendance = pgTable('meeting_attendance', {
  meetingId: text('meeting_id').primaryKey(),
  ministrySlugs: jsonb('ministry_slugs').$type<string[]>().notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
