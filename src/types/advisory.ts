
export interface Advisory {
  id: string;
  created_at: string;
  title: string;
  content: string;
  dentist_name: string;
  appointment_id: string | null;
  priority: string;
  is_read: boolean;
  client_id: string;
}
