export type FileType = 'folder' | 'text' | 'image' | 'app' | 'locked' | 'video';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  children?: FileSystemItem[];
  icon?: string;
  locked?: boolean;
}

export const initialFileSystem: FileSystemItem[] = [
  {
    id: 'about',
    name: 'About Me.txt',
    type: 'text',
    content: `HELLO WORLD!\n\nI am a creative developer based in the digital realm.\n\nThis portfolio mimics a retro operating system.`
  },
  {
    id: 'projects',
    name: 'Projects',
    type: 'folder',
    children: [
      { 
        id: 'p1', 
        name: 'Blender Animation', 
        type: 'text', 
        content: 'Check out my latest 3D work. (See intro video!)' 
      },
      { 
        id: 'p2', 
        name: 'Retro Website', 
        type: 'text', 
        content: 'You are looking at it right now.' 
      },
    ]
  },
  {
    id: 'snake_game',
    name: 'Snake.exe',
    type: 'app',
    content: 'Game Application'
  },
  {
    id: 'paint_app',
    name: 'Paint.exe',
    type: 'app',
    content: 'Paint Application'
  },
  {
    id: 'secret_file',
    name: 'VIDEO +18.mp4',
    type: 'locked',
    locked: true,
    content: 'zZ6vybT1HQs' // Youtube ID for Rick Roll
  },
  {
    id: 'trash',
    name: 'Trash',
    type: 'folder',
    children: []
  }
];
