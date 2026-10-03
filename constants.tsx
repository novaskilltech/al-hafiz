
import React from 'react';
import { Reciter } from './types';

export const RECITERS: Reciter[] = [
  // Hafs
  { id: 'Husary_Muallim_128kbps', name: 'Mahmoud Khalil Al-Hussary (Muallim)', version: 'Hafs' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Hussary', version: 'Hafs' },
  { id: 'mahmoud_ali_al_banna_32kbps', name: 'Mahmoud Ali Al-Banna', version: 'Hafs' },
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', version: 'Hafs' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit Murattal', version: 'Hafs' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq al-Minshawi', version: 'Hafs' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'Muhammad Ayyoub', version: 'Hafs' },
  // Warsh
  { id: 'warsh/warsh_Abdul_Basit_128kbps', name: 'Abdul Basit', version: 'Warsh' },
  { id: 'warsh/warsh_ibrahim_aldosary_128kbps', name: 'Ibrahim Al Dosary', version: 'Warsh' },
  { id: 'warsh/warsh_yassin_al_jazaery_64kbps', name: 'Yassin Al Jazaery', version: 'Warsh' },
];

export const SIGNATURE = "Abou soulaymane Salah eddine Ahmed";
export const DEDICATION = "Ceci est une sadaqa jariah (aumône perpétuelle) pour moi, mon père, ma mère et toute ma famille.";

export const ISLAMIC_PATTERN = (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-10 absolute pointer-events-none">
    <path d="M50 0L61.2257 38.7743L100 50L61.2257 61.2257L50 100L38.7743 61.2257L0 50L38.7743 38.7743L50 0Z" fill="currentColor"/>
  </svg>
);
