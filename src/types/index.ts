export interface UserDetails {
  name: string;
  email: string;
  rollNo: string;
  institution: string;
}

export interface PledgeCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  options: string[];
}

export interface SelectedPledges {
  [categoryId: string]: string[];
}

export interface FormData {
  userDetails: UserDetails;
  pledges: SelectedPledges;
  photoUrl: string | null;
}
