
export interface User {
  user_id: number;
  name: string;
  email: string;
  area_id: number | null;
  boss_id: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserDTO {
  name: string;
  email: string;
  user_id: number;
}

export interface UserWithDetails extends UserDTO {
  area_name?: string;
  boss_name?: string;
}