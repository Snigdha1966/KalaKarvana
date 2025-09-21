
import React from 'react';
import { Tool } from './types';
import SparklesIcon from './components/icons/SparklesIcon';
import PhotoIcon from './components/icons/PhotoIcon';
import VideoIcon from './components/icons/VideoIcon';
import BookOpenIcon from './components/icons/BookOpenIcon';
import StoreIcon from './components/icons/StoreIcon';
import BookmarkIcon from './components/icons/BookmarkIcon';
import BrushIcon from './components/icons/BrushIcon';

export const TOOLS = [
  {
    id: Tool.CAPTION_GENERATOR,
    name: 'Caption Crafter',
    description: 'Generate beautiful captions for your art.',
    icon: <SparklesIcon />,
  },
  {
    id: Tool.IMAGE_EDITOR,
    name: 'Image Alchemist',
    description: 'Edit & collage photos with AI.',
    icon: <PhotoIcon />,
  },
  {
    id: Tool.VIDEO_GENERATOR,
    name: 'Story Weaver',
    description: 'Create videos sharing your artistic journey.',
    icon: <VideoIcon />,
  },
  {
    id: Tool.MARKETING_GUIDE,
    name: 'Digital Guru',
    description: 'Learn social media marketing strategies.',
    icon: <BookOpenIcon />,
  },
  {
    id: Tool.ART_STYLE_ADVISOR,
    name: 'Art Style Advisor',
    description: 'Get AI feedback on your artistic style.',
    icon: <BrushIcon />,
  },
  {
    id: Tool.VIRTUAL_STORE,
    name: 'Virtual Gallery',
    description: 'Showcase your art to the world.',
    icon: <StoreIcon />,
  },
  {
    id: Tool.MY_COLLECTION,
    name: 'My Collection',
    description: 'View your saved creations.',
    icon: <BookmarkIcon />,
  },
];