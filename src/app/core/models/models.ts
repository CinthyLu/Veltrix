// ─────────────────────────────────────────────
// Strapi API Response wrapper
// ─────────────────────────────────────────────
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiItem<T> {
  id: number;
  documentId: string;
  attributes?: T;
}

// ─────────────────────────────────────────────
// Tecnología
// ─────────────────────────────────────────────
export interface Tecnologia {
  id: number;
  documentId: string;
  nombre: string;
  logo?: string;
  categoria?: string;
}

// ─────────────────────────────────────────────
// Servicio
// ─────────────────────────────────────────────
export interface Servicio {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: string;
  icono?: string;
}

// ─────────────────────────────────────────────
// Proyecto
// ─────────────────────────────────────────────
export interface Proyecto {
  id: number;
  documentId: string;
  nombre: string;
  descripcion: string;
  imagen?: string;
  url?: string;
  destacado: boolean;
  tecnologias?: Tecnologia[];
  programadores?: Programador[];
}

// ─────────────────────────────────────────────
// Programador
// ─────────────────────────────────────────────
export interface Programador {
  id: number;
  documentId: string;
  nombre: string;
  apellido: string;
  email: string;
  foto?: string;
  bio?: string;
  especialidad?: string;
  tecnologias?: Tecnologia[];
  proyectos?: Proyecto[];
}

// ─────────────────────────────────────────────
// Home Content
// ─────────────────────────────────────────────
export interface HomeContent {
  id: number;
  documentId: string;
  titulo_hero: string;
  subtitulo_hero: string;
  descripcion_empresa: string;
  imagen_hero?: string;
}

// ─────────────────────────────────────────────
// Solicitud de Contacto (Firestore)
// ─────────────────────────────────────────────
export type EstadoSolicitud = 'Pendiente' | 'Respondida';

export interface Solicitud {
  id?: string;
  uid: string;
  correoUsuario: string;
  nombreSolicitante: string;
  correoSolicitante: string;
  descripcionProyecto: string;
  programadorId: string;
  programadorNombre: string;
  fechaCreacion: Date | null;
  estado: EstadoSolicitud;
  observacion?: string;
}
