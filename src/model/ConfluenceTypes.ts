export interface Version {
  createdAt: string;
  message: string;
  number: number;
  minorEdit: boolean;
  authorId: string;
}

export interface Attachment {
  id: string;
  status: string;
  title: string;
  mediaType: string;
  mediaTypeDescription: string;
  comment: string;
  fileSize: number;
  webuiLink: string;
  downloadLink: string;
  version: Version;
}