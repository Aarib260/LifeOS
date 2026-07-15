export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  eventDate: string; // YYYY-MM-DD
  startTime: string | null; // HH:MM, null = all-day
  endTime: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  color?: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string | null;
  eventDate?: string;
  startTime?: string | null;
  endTime?: string | null;
  color?: string;
}