import { CalculationResult } from '../types';

// Convert IP string to 32-bit unsigned integer
export const ipToInt = (ip: string): number => {
  return ip.split('.').reduce((acc, octet) => {
    return ((acc << 8) + parseInt(octet, 10)) >>> 0;
  }, 0);
};

// Convert 32-bit integer to IP string
export const intToIp = (int: number): string => {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join('.');
};

// Convert integer to binary string with dot separation
export const intToBinaryString = (int: number): string => {
  const bin = (int >>> 0).toString(2).padStart(32, '0');
  return `${bin.slice(0, 8)}.${bin.slice(8, 16)}.${bin.slice(16, 24)}.${bin.slice(24, 32)}`;
};

export const isValidIp = (ip: string): boolean => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
};

export const getIpClass = (firstOctet: number): string => {
  if (firstOctet >= 0 && firstOctet <= 127) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  return 'E (Experimental)';
};

export const getIpType = (ipInt: number): 'Public' | 'Private' | 'Loopback' | 'Multicast' | 'Reserved' => {
  const firstOctet = (ipInt >>> 24) & 255;
  const secondOctet = (ipInt >>> 16) & 255;

  // Private
  // 10.0.0.0/8
  if (firstOctet === 10) return 'Private';
  // 172.16.0.0/12
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private';
  // 192.168.0.0/16
  if (firstOctet === 192 && secondOctet === 168) return 'Private';

  // Loopback 127.0.0.0/8
  if (firstOctet === 127) return 'Loopback';

  // Multicast 224.0.0.0/4
  if (firstOctet >= 224 && firstOctet <= 239) return 'Multicast';

  // Reserved/Experimental 240.0.0.0/4
  if (firstOctet >= 240) return 'Reserved';

  return 'Public';
};

export const calculateSubnet = (ip: string, maskBits: number): CalculationResult | null => {
  if (!isValidIp(ip)) return null;
  if (maskBits < 0 || maskBits > 32) return null;

  const ipInt = ipToInt(ip);
  // Calculate mask: shift 1s to the left (32-bits)
  const maskInt = maskBits === 0 ? 0 : (~((1 << (32 - maskBits)) - 1)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
  
  // Wildcard is inverse of mask
  const wildcardInt = (~maskInt) >>> 0;

  const totalHosts = maskBits === 32 ? 1 : Math.pow(2, 32 - maskBits);
  const usableHosts = maskBits >= 31 ? 0 : totalHosts - 2;

  const firstUsableInt = maskBits >= 31 ? networkInt : (networkInt + 1) >>> 0;
  const lastUsableInt = maskBits >= 31 ? broadcastInt : (broadcastInt - 1) >>> 0;

  return {
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstUsable: intToIp(firstUsableInt),
    lastUsable: intToIp(lastUsableInt),
    subnetMask: intToIp(maskInt),
    wildcardMask: intToIp(wildcardInt),
    totalHosts,
    usableHosts,
    cidrNotation: `${intToIp(networkInt)}/${maskBits}`,
    binaryIp: intToBinaryString(ipInt),
    binaryMask: intToBinaryString(maskInt),
    binaryNetwork: intToBinaryString(networkInt),
    ipClass: getIpClass((ipInt >>> 24) & 255),
    ipType: getIpType(ipInt),
  };
};
