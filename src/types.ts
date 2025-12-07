
export enum ChatMode {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  WAITING = 'WAITING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR'
}

export interface UserProfile {
  username: string;
  age: string;
  gender: string;
  interests: string[];
  location: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'stranger' | 'system';
  timestamp: number;
  isVanish?: boolean;
}

export interface PeerData {
  type: 'message' | 'typing' | 'disconnect' | 'profile';
  payload?: any;
}

// Presence state for the lobby
export interface PresenceState {
  peerId: string;
  status: 'waiting' | 'paired';
  timestamp: number;
}
