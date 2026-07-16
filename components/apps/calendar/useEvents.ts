"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent, CreateEventInput, UpdateEventInput } from "@/types/event";

const EVENTS_KEY = ["events"] as const;

async function fetchEvents(): Promise<CalendarEvent[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

async function createEventRequest(input: CreateEventInput): Promise<CalendarEvent> {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

async function updateEventRequest(id: string, input: UpdateEventInput): Promise<CalendarEvent> {
  const res = await fetch(`/api/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

async function deleteEventRequest(id: string): Promise<void> {
  const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete event");
}

export function useEvents() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: EVENTS_KEY, queryFn: fetchEvents });

  const createEvent = useMutation({
    mutationFn: createEventRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) =>
      updateEventRequest(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });

  const deleteEvent = useMutation({
    mutationFn: deleteEventRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}