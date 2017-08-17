export interface Nightclub {
  address: string;
  state?: string;
  city: string;
  icon: string;
  name: string;
  peopleGoing: number;
  photos?: Array<any>;
  rating: number; 
  currentUserGoing?: boolean;
}

export interface NightclubExtended extends Nightclub {
    src: string;
}

