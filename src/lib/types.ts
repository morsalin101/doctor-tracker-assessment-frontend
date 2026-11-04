export type Doctor = {
  _id: string; name: string; specialization: string; hospital: string; phone: string; email: string; createdAt: string; patientCount?: number;
};

export type Patient = {
  _id: string; fullName: string; dateOfBirth: string; gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'; phone: string; email?: string; address?: string; condition: string; doctorId: Doctor; createdAt: string;
};

export type Meta = { page: number; limit: number; total: number; pages: number };
export type ApiResponse<T> = { success: true; data: T; meta?: Meta };
export type DashboardData = {
  totals: { doctors: number; patients: number };
  patientsPerDoctor: { doctorId: string; doctorName: string; count: number }[];
  registrationsByMonth: { period: string; count: number }[];
  conditionDistribution: { condition: string; count: number }[];
  recentPatients: Patient[];
};
