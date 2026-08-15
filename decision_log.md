# Decision Log - Al-Hafiz

Ce fichier consigne l'ensemble des décisions d'architecture, de conception, de sécurité et de conformité prises par l'équipe **NOVA SQUAD** au cours du développement du projet.

---

## [DEC-001] Ajustement de la taille du texte (Zoom Verset)
- **Date** : 20 juin 2026
- **Auteur** : NOVA-ARCH & NOVA-FE
- **Décision** : Ajout de contrôles universels de zoom (boutons A- / A+) dans le composant `Reader`.
- **Justification** : Améliorer l'accessibilité pour les utilisateurs ayant des difficultés à lire les caractères arabes ou les écritures fines de la calligraphie originale.
- **Alternatives envisagées** : Zoom par pincement (pinch-to-zoom) sur mobile (rejeté car plus complexe à implémenter de manière stable et non conforme aux exigences d'un bouton de contrôle simple).
- **Impacts** :
  - L'état de zoom `fontSize` est stocké dans le `localStorage` pour persister entre les sessions.
  - La hauteur des images de calligraphie originale dans `AyahDisplay` est ajustée proportionnellement (`fontSize * 2.5`).
- **Statut** : Approuvé & Implémenté.

---

## [DEC-002] Code Couleur de Mémorisation
- **Date** : 20 juin 2026
- **Auteur** : NOVA-UX & NOVA-FE
- **Décision** : Surligner les versets mémorisés avec un fond vert émeraude léger (`bg-[#859900]/5`) et ajouter un badge vert "Mémorisé ✓".
- **Justification** : Permettre une identification visuelle instantanée des versets maîtrisés par l'utilisateur lors de la lecture d'une sourate.
- **Alternatives envisagées** : Icônes d'étoiles ou uniquement des bordures (rejeté car moins lisible lors du défilement rapide).
- **Impacts** :
  - Détection automatique via la clé `alhafiz_mastered` dans le stockage local.
  - Actualisation automatique en temps réel via un écouteur d'événement personnalisé `storage_update` pour refléter les verdicts réussis d'évaluation IA.
- **Statut** : Approuvé & Implémenté.

---

## [DEC-003] Limitation et Validation Dynamique du Lecteur Audio Rapide
- **Date** : 20 juin 2026
- **Auteur** : NOVA-LEAD & NOVA-QA
- **Décision** : Ajout d'une table statique `SURAH_VERSES` dans `QuickAudioPlayer` contenant les nombres réels de versets par sourate (1 à 114) et validation stricte lors des changements et de la perte de focus.
- **Justification** : Empêcher l'utilisateur de saisir des numéros de versets inexistants (comme le verset 332 pour la sourate 5) ce qui provoquait des requêtes d'audios indisponibles ou des crashs du lecteur audio.
- **Alternatives envisagées** :
  - Appel API asynchrone pour charger dynamiquement le nombre de versets (rejeté car cela introduit de la latence dans la validation de l'input et nécessite de gérer un état de chargement supplémentaire).
- **Impacts** :
  - Plafonnement immédiat de la saisie utilisateur.
  - Rétro-compatibilité et réajustement automatique du verset lors du changement de sourate (ex: passer de la sourate 2 verset 200 à la sourate 5 ramène automatiquement le verset à 120, le maximum de la sourate Al-Ma'ida).
- **Statut** : Approuvé & Implémenté.

---

## [DEC-004] Pages explicatives interactives des fonctionnalités
- **Date** : 20 juin 2026
- **Auteur** : NOVA-UX & NOVA-FE
- **Décision** : Rendre interactives les cartes des fonctionnalités sur la Landing Page en ouvrant un panneau modal explicatif détaillé.
- **Justification** : Permettre à l'utilisateur de comprendre immédiatement comment fonctionnent la Double Récitation, l'Examinateur IA, et la Calligraphie/Audio avant d'accéder à l'application web.
- **Alternatives envisagées** : Pages de routage séparées (rejeté car cela alourdit la navigation et rompt l'expérience fluide de la landing page single-page).
- **Impacts** :
  - Ajout de l'état `selectedSection` dans `LandingPage`.
  - Design premium avec effet de flou en arrière-plan (`backdrop-blur-md`), transitions fluides (`animate-in zoom-in-95`), et boutons d'action rapide vers l'application.
- **Statut** : Approuvé & Implémenté.

---

## [DEC-005] Traduction multilingue et support RTL sur la Landing Page
- **Date** : 20 juin 2026
- **Auteur** : NOVA-UX & NOVA-FE
- **Décision** : Intégrer un sélecteur de langue (FR / AR) dans l'en-tête de la Landing Page, avec traduction complète de tous les éléments textuels et adaptation de la direction d'écriture (RTL - Right To Left) en arabe.
- **Justification** : Offrir une accessibilité et une expérience utilisateur native et immersive dans la langue d'étude coranique.
- **Alternatives envisagées** : Détection automatique de la langue du navigateur (rejeté car cela prive l'utilisateur du contrôle explicite de son choix linguistique).
- **Impacts** :
  - Ajout de l'état `lang` dans `LandingPage`.
  - Application conditionnelle de l'attribut `dir="rtl"` et alignements de textes appropriés.
- **Statut** : Approuvé & Implémenté.

---

## [DEC-006] Traduction et support RTL de l'application web
- **Date** : 20 juin 2026
- **Auteur** : NOVA-UX & NOVA-FE
- **Décision** : Étendre le support bilingue (FR / AR) et l'orientation d'écriture RTL à tous les composants de l'application web principale (`Layout`, `App` dashboard, `Reader`, `QuickAudioPlayer`, `HifzValidator`).
- **Justification** : Permettre à l'utilisateur de basculer de langue de manière fluide à tout moment (sélecteur dans la barre d'outils de l'en-tête), avec persistance de sa préférence linguistique dans `localStorage` pour les visites futures.
- **Alternatives envisagées** : Traduction partielle ou dépendance à des librairies tierces comme `i18next` (rejeté pour éliminer toute dépendance supplémentaire et maintenir un bundle léger et performant).
- **Impacts** :
  - L'orientation (`dir="rtl"`) s'applique sur le conteneur principal de `Layout.tsx` pour réaligner dynamiquement tous les composants.
  - Traduction de l'en-tête, du tableau de bord de mémorisation, de la barre d'outils du lecteur, du widget audio et des boutons d'évaluation IA.
- **Statut** : Approuvé & Implémenté.
