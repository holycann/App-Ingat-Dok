export type DocumentType = "KTP" | "SIM" | "STNK" | "Passport" | "Other";

export interface BaseDocumentFields {
  documentNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  holderName?: string;
}

export interface KTPFields extends BaseDocumentFields {
  nik?: string;
  address?: string;
  province?: string;
  city?: string;
  bloodType?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
}

export interface SIMFields extends BaseDocumentFields {
  simClass?: "A" | "B" | "C";
  validUntil?: Date;
  policeNumber?: string;
}

export interface STNKFields extends BaseDocumentFields {
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  engineNumber?: string;
  chassisNumber?: string;
  registrationYear?: number;
  taxExpiration?: Date;
}

export interface PassportFields extends BaseDocumentFields {
  passportType?: "Biasa" | "Diplomatik" | "Dinas";
  nationality?: string;
  placeOfBirth?: string;
  birthDate?: Date;
  gender?: "Male" | "Female";
  authority?: string;
}

export type DocumentTypeFields =
  | KTPFields
  | SIMFields
  | STNKFields
  | PassportFields;
