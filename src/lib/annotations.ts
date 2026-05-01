import { TrackingPoint } from '../types/movebank';

interface Annotation {
  id: string;
  pointIndex: number;
  animalId: string;
  text: string;
  timestamp: string;
  createdAt: string;
  color?: string;
}

const STORAGE_KEY = 'movebank-annotations';

export function loadAnnotations(animalId: string): Annotation[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`${STORAGE_KEY}-${animalId}`);
  return stored ? JSON.parse(stored) : [];
}

export function saveAnnotation(annotation: Annotation): void {
  if (typeof window === 'undefined') return;
  const annotations = loadAnnotations(annotation.animalId);
  annotations.push(annotation);
  localStorage.setItem(`${STORAGE_KEY}-${annotation.animalId}`, JSON.stringify(annotations));
}

export function deleteAnnotation(animalId: string, annotationId: string): void {
  if (typeof window === 'undefined') return;
  const annotations = loadAnnotations(animalId).filter(a => a.id !== annotationId);
  localStorage.setItem(`${STORAGE_KEY}-${animalId}`, JSON.stringify(annotations));
}

export function getAnnotationsForPoint(animalId: string, pointIndex: number): Annotation[] {
  return loadAnnotations(animalId).filter(a => a.pointIndex === pointIndex);
}

export function generateAnnotationId(): string {
  return `ann-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Extend TrackingPoint with optional annotation flag
declare module '../types/movebank' {
  interface TrackingPoint {
    annotation?: string; // Simple note
  }
}
