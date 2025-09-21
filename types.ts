
export enum Tool {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  CAPTION_GENERATOR = 'CAPTION_GENERATOR',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  VIDEO_GENERATOR = 'VIDEO_GENERATOR',
  MARKETING_GUIDE = 'MARKETING_GUIDE',
  ART_STYLE_ADVISOR = 'ART_STYLE_ADVISOR',
  VIRTUAL_STORE = 'VIRTUAL_STORE',
  MY_COLLECTION = 'MY_COLLECTION',
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

// New types for saved creations
export interface SavedCaptionContent {
  title: string;
  caption: string;
  hashtags: string;
}

export interface SavedVideoContent {
  prompt: string;
  videoUrl: string;
}

export interface SavedImageContent {
  prompt: string;
  originalImageBase64: string;
  originalImageMimeType: string;
  editedImageBase64Url: string;
}

export interface SavedCaption {
    id: string;
    type: 'caption';
    content: SavedCaptionContent;
    createdAt: number;
}

export interface SavedVideo {
    id: string;
    type: 'video';
    content: SavedVideoContent;
    createdAt: number;
}

export interface SavedImage {
    id: string;
    type: 'image';
    content: SavedImageContent;
    createdAt: number;
}

export type SavedCreation = SavedCaption | SavedVideo | SavedImage;