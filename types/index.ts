// Province types
export interface Province {
  id: number;
  nameTh: string;
  nameEn: string;
  region: 'central' | 'north' | 'northeast' | 'east' | 'west' | 'south';
}

// Case type definitions
export interface CaseSubtype {
  id: number;
  code: string;
  nameTh: string;
  nameEn: string;
}

export interface CaseType {
  id: number;
  code: 'civil' | 'criminal' | 'corporate';
  nameTh: string;
  nameEn: string;
  subtypes: CaseSubtype[];
}

// Lawyer types
export interface LawyerSpecialization {
  caseType: 'civil' | 'criminal' | 'corporate';
  subtypeId: number;
}

export interface LawyerAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  isActive: boolean;
}

export interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  licenseNo: string;
  profileImageUrl: string;
  bio: string;
  experienceYears: number;
  rating: number;
  totalReviews: number;
  totalCases: number;
  isAvailable: boolean;
  isRecommended?: boolean;
  isNationwide?: boolean;
  serviceRegions?: string[];
  specializations: LawyerSpecialization[];
  serviceAreas: Province[];
  pricePerHour: number;
  availability?: LawyerAvailability[];
}

// Service package types
export interface ServicePackage {
  id: number;
  name: string;
  nameTh: string;
  durationMinutes: number;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

// Testimonial types
export interface Testimonial {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  caseType: string;
  quote: string;
  date: string;
}

// FAQ types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// Blog types
export type BlogCategory = 'civil' | 'criminal' | 'corporate' | 'general';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage?: string;
  category: BlogCategory;
  categoryLabel: string;
  tags: string[];
  featuredImage: string;
  publishedDate: string;
  readTime: number;
  isFeatured?: boolean;
}

// User types
export type UserRole = 'client' | 'lawyer' | 'admin';

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
  idCardNumber?: string;
  provinceId?: number;
  role: UserRole;
  isVerified: boolean;
  status?: 'pending' | 'verified' | 'suspended';
  createdAt: string;
  verifiedAt?: string;
}

export interface CorporateUser extends User {
  userType: 'corporate';
  organizationName: string;
  organizationType: string;
  taxId?: string;
  contactPerson: string;
  contactEmail?: string;
}

// Consultation types
export type ConsultationStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Consultation {
  id: string;
  bookingCode: string;
  userId: string;
  lawyerId: string;
  packageId: number;
  caseStatus: 'being_sued' | 'will_sue' | 'consultation';
  caseType: 'civil' | 'criminal';
  caseSubtypeId?: number;
  caseDescription?: string;
  scheduledDatetime: string;
  provinceId: number;
  status: ConsultationStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

// Payment types
export interface Payment {
  id: string;
  referenceType: 'consultation' | 'case_first' | 'case_second';
  referenceId: string;
  amount: number;
  paymentMethod: 'promptpay' | 'bank_transfer';
  transactionRef?: string;
  qrCodeUrl?: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
}

// Stats for landing page
export interface PlatformStats {
  totalLawyers: number;
  totalCases: number;
  totalUsers: number;
  totalProvinces: number;
  averageRating: number;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
