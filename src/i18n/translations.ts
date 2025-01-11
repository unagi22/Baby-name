import { type Language } from '../types';

export const translations = {
  crnogorski: {
    // CreateProject page
    createProject: {
      title: 'Napravite Novi Projekat',
      description: 'Unesite imena roditelja i pol bebe da započnete',
      parentsNames: 'Imena roditelja',
      parentsNamesPlaceholder: 'npr. Marko i Ana',
      genderPreference: 'Pol bebe',
      boy: 'Dječak',
      girl: 'Djevojčica',
      either: 'Svejedno',
      createButton: 'Napravi Projekat',
      errorMessage: 'Molimo unesite imena roditelja'
    },
    // Landing page
    landing: {
      title: 'Dobrodošli u Bebino Ime',
      description: 'Započnite putovanje ka pronalasku savršenog imena za vašu bebu. Napravite novi projekat da počnete sa prikupljanjem i organizovanjem predloga imena.',
      createButton: 'Napravite Vaš Prvi Projekat',
      features: {
        createShare: {
          title: 'Napravite i Podijelite',
          description: 'Započnite projekat i podijelite ga sa porodicom i prijateljima da sakupite predloge imena.'
        },
        collaborate: {
          title: 'Sarađujte',
          description: 'Dozvolite voljenima da doprinesu svojim omiljenim imenima i glasaju za predloge.'
        },
        chooseTogether: {
          title: 'Izaberite Zajedno',
          description: 'Pronađite savršeno ime gledajući koji se predlozi najviše sviđaju svima.'
        }
      }
    },
    // ProjectView page
    projectView: {
      lookingForNames: 'Traže imena za bebu',
      noNamesYet: 'Još nema imena',
      addFirstName: 'Dodaj Prvo Ime',
      addNewName: 'Dodaj Novo Ime',
      allNames: 'Sva Imena',
      favorites: 'Omiljeni',
      noFavorites: 'Još nema omiljenih imena',
      starToAdd: 'Označi imena zvjezdicom da ih dodaš u omiljene',
      suggestName: 'Predloži Ime',
      babyName: 'Ime Bebe',
      enterBabyName: 'Unesi ime bebe',
      gender: 'Pol',
      yourName: 'Tvoje Ime',
      enterYourName: 'Unesi tvoje ime',
      submit: 'Pošalji Predlog',
      suggestedBy: 'Predložio/la',
      unlike: 'Ukloni sviđanje',
      like: 'Sviđa mi se',
      addToFavorites: 'Dodaj u omiljene',
      removeFromFavorites: 'Ukloni iz omiljenih'
    },
    // Common
    filters: {
      title: 'Filteri',
      gender: 'Pol',
      allGenders: 'Svi Polovi',
      maleNames: 'Muška Imena',
      femaleNames: 'Ženska Imena',
      sortBy: 'Sortiraj Po',
      newest: 'Najnovije',
      popular: 'Najpopularnije',
      byContributor: 'Po Predlagaču',
      allContributors: 'Svi Predlagači'
    },
    // Language switcher
    language: {
      switchToEnglish: 'Switch to English'
    }
  },
  english: {
    // CreateProject page
    createProject: {
      title: 'Create New Project',
      description: 'Enter parents\' names and gender preference to get started',
      parentsNames: 'Parents\' Names',
      parentsNamesPlaceholder: 'e.g. John and Jane',
      genderPreference: 'Gender Preference',
      boy: 'Boy',
      girl: 'Girl',
      either: 'Either',
      createButton: 'Create Project',
      errorMessage: 'Please enter parents\' names'
    },
    // Landing page
    landing: {
      title: 'Welcome to Baby Name Explorer',
      description: 'Start your journey to find the perfect name for your baby. Create a new project to begin collecting and organizing name suggestions.',
      createButton: 'Create Your First Project',
      features: {
        createShare: {
          title: 'Create & Share',
          description: 'Start a project and share it with family and friends to collect name suggestions.'
        },
        collaborate: {
          title: 'Collaborate',
          description: 'Let loved ones contribute their favorite names and vote on suggestions.'
        },
        chooseTogether: {
          title: 'Choose Together',
          description: 'Find the perfect name by seeing which suggestions resonate most with everyone.'
        }
      }
    },
    // ProjectView page
    projectView: {
      lookingForNames: 'Looking for baby names',
      noNamesYet: 'No names yet',
      addFirstName: 'Add First Name',
      addNewName: 'Add New Name',
      allNames: 'All Names',
      favorites: 'Favorites',
      noFavorites: 'No favorite names yet',
      starToAdd: 'Star names to add them to your favorites',
      suggestName: 'Suggest a Name',
      babyName: 'Baby Name',
      enterBabyName: 'Enter a baby name',
      gender: 'Gender',
      yourName: 'Your Name',
      enterYourName: 'Enter your name',
      submit: 'Submit Suggestion',
      suggestedBy: 'Suggested by',
      unlike: 'Unlike',
      like: 'Like',
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites'
    },
    // Common
    filters: {
      title: 'Filters',
      gender: 'Gender',
      allGenders: 'All Genders',
      maleNames: 'Male Names',
      femaleNames: 'Female Names',
      sortBy: 'Sort By',
      newest: 'Newest First',
      popular: 'Most Popular',
      byContributor: 'By Contributor',
      allContributors: 'All Contributors'
    },
    // Language switcher
    language: {
      switchToEnglish: 'Promijeni na Crnogorski'
    }
  }
} as const;
