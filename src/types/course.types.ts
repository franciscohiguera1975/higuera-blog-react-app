// src/types/course.types.ts
export interface Instructor {
  nombre: string
  email: string
}

export interface Contenido {
  _id: string
  titulo: string
  duracion: number
  descripcion: string
  tipo: string
  enlace: string
  dificultad: string
  fecha_publicacion: string
  completado: boolean
  tiempo_estimado: string
  video_id: string
}

export interface Curso {
  _id: string
  nombre: string
  descripcion: string
  categoria: string
  fecha_inicio: string
  fecha_fin: string
  nivel: string
  requisitos: string[]
  precio: number
  instructor: Instructor
  calificacion_promedio: number
  estado: string
  contenidos: Contenido[]
}

export interface CreateCoursePayload {
  nombre: string
  descripcion: string
  categoria: string
  fecha_inicio: string
  fecha_fin: string
  nivel: string
  precio: number
  instructor: Instructor
  requisitos?: string[]
}