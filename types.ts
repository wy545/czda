export interface ArchiveItem {
  id: string;
  title: string;
  category: string;
  organization: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  imageUrl: string;
  description?: string;
}

export interface Notification {
  id: string;
  type: 'certificate' | 'status' | 'milestone' | 'system' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'older';
}

export interface UserStats {
  honors: number;
  penalties: number;
  internshipHours: number;
}

export interface UserProfile {
  name: string;
  studentId: string;
  avatar: string;
  grade: string;
  major: string;
  university: string;
}