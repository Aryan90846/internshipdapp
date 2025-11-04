export interface CertificateMetadata {
  name: string;
  description: string;
  image: string;
  attributes: CertificateAttribute[];
  metadata_hash: string;
}

export interface CertificateAttribute {
  trait_type: string;
  value: string;
}

export interface Certificate {
  tokenId: number;
  owner: string;
  metadataUri: string;
  metadata?: CertificateMetadata;
  isRevoked: boolean;
  certificateId?: string;
}

export interface MintFormData {
  recipient: string;
  name: string;
  program: string;
  issueDate: string;
  certificateId: string;
}

export interface BatchMintData {
  recipient: string;
  name: string;
  program: string;
  issueDate: string;
  certificateId: string;
}
