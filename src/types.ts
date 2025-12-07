
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

export type MessageType = 'text' | 'image' | 'audio';

export interface Message {
  id: string;
  text?: string;
  fileData?: string; // Base64 string for images/audio
  type: MessageType;
  sender: 'me' | 'stranger' | 'system';
  timestamp: number;
  isVanish?: boolean;
}

export interface PeerData {
  type: 'message' | 'typing' | 'recording' | 'disconnect' | 'profile';
  payload?: any;
  dataType?: MessageType;
}

// Presence state for the lobby
export interface PresenceState {
  peerId: string;
  status: 'waiting' | 'paired';
  timestamp: number;
}
