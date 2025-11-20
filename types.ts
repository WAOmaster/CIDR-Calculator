export interface CidrData {
  ipAddress: string;
  maskBits: number;
}

export interface CalculationResult {
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  cidrNotation: string;
  binaryIp: string;
  binaryMask: string;
  binaryNetwork: string;
  ipClass: string;
  ipType: 'Public' | 'Private' | 'Loopback' | 'Multicast' | 'Reserved';
}

export interface AiAnalysisResult {
  summary: string;
  useCases: string[];
  securityNotes: string;
}
