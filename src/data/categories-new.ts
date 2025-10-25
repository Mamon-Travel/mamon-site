import stayCategoryCoverImage from '@/images/hero-right-2.png'
import carCategoryCoverImage from '@/images/hero-right-car.png'
import experienceCategoryCoverImage from '@/images/hero-right-experience.png'
import filghtCategoryCoverImage from '@/images/hero-right-flight.png'
import realEstateCategoryCoverImage from '@/images/hero-right-real-estate.png'
import categoryService from '@/services/categoryService'

// Hizmet ID'leri (backend hizmetler tablosundan)
const HIZMET_IDS = {
  STAY: 1,
  CAR: 2,
  EXPERIENCE: 3,
  REAL_ESTATE: 4,
  FLIGHT: 5,
}

// Default cover images
const DEFAULT_COVERS = {
  stay: stayCategoryCoverImage,
  car: carCategoryCoverImage,
  experience: experienceCategoryCoverImage,
  realEstate: realEstateCategoryCoverImage,
  flight: filghtCategoryCoverImage,
}

// ===== STAY CATEGORIES =====
export async function getStayCategories() {
  try {
    const categories = await categoryService.getByHizmetId(HIZMET_IDS.STAY);
    return categories.map(cat => ({
      ...categoryService.formatCategory(cat, 'stay'),
      coverImage: cat.kapak_gorseli ? {
        src: cat.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.stay.src,
        width: DEFAULT_COVERS.stay.width,
        height: DEFAULT_COVERS.stay.height,
      },
    }));
  } catch (error) {
    console.error('Stay kategorileri yüklenemedi:', error);
    return []; // Boş array döndür
  }
}

export async function getStayCategoryByHandle(handle?: string) {
  if (!handle || handle === 'all') {
    return {
      id: 'stay://all',
      name: 'Explore stays',
      handle: 'all',
      href: '/stay-categories/all',
      region: 'Worldwide',
      count: 144000,
      description: 'Explore all stays around the world',
      thumbnail: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
      coverImage: {
        src: DEFAULT_COVERS.stay.src,
        width: DEFAULT_COVERS.stay.width,
        height: DEFAULT_COVERS.stay.height,
      },
    }
  }

  try {
    const category = await categoryService.getBySlug(handle.toLowerCase(), HIZMET_IDS.STAY);
    return {
      ...categoryService.formatCategory(category, 'stay'),
      coverImage: category.kapak_gorseli ? {
        src: category.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.stay.src,
        width: DEFAULT_COVERS.stay.width,
        height: DEFAULT_COVERS.stay.height,
      },
    };
  } catch (error) {
    console.error('Stay kategori bulunamadı:', error);
    return undefined;
  }
}

// ===== EXPERIENCE CATEGORIES =====
export async function getExperienceCategories() {
  try {
    const categories = await categoryService.getByHizmetId(HIZMET_IDS.EXPERIENCE);
    return categories.map(cat => ({
      ...categoryService.formatCategory(cat, 'experience'),
      coverImage: cat.kapak_gorseli ? {
        src: cat.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.experience.src,
        width: DEFAULT_COVERS.experience.width,
        height: DEFAULT_COVERS.experience.height,
      },
    }));
  } catch (error) {
    console.error('Experience kategorileri yüklenemedi:', error);
    return [];
  }
}

export async function getExperienceCategoryByHandle(handle?: string) {
  if (!handle || handle === 'all') {
    return {
      id: 'experience://all',
      name: 'Explore experiences',
      handle: 'all',
      region: 'Worldwide',
      href: '/experience-categories/all',
      description: 'Explore all experiences around the world',
      count: 3000,
      thumbnail: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
      coverImage: {
        src: DEFAULT_COVERS.experience.src,
        width: DEFAULT_COVERS.experience.width,
        height: DEFAULT_COVERS.experience.height,
      },
    }
  }

  try {
    const category = await categoryService.getBySlug(handle.toLowerCase(), HIZMET_IDS.EXPERIENCE);
    return {
      ...categoryService.formatCategory(category, 'experience'),
      coverImage: category.kapak_gorseli ? {
        src: category.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.experience.src,
        width: DEFAULT_COVERS.experience.width,
        height: DEFAULT_COVERS.experience.height,
      },
    };
  } catch (error) {
    console.error('Experience kategori bulunamadı:', error);
    return undefined;
  }
}

// ===== REAL ESTATE CATEGORIES =====
export async function getRealEstateCategories() {
  try {
    const categories = await categoryService.getByHizmetId(HIZMET_IDS.REAL_ESTATE);
    return categories.map(cat => ({
      ...categoryService.formatCategory(cat, 'real-estate'),
      coverImage: cat.kapak_gorseli ? {
        src: cat.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.realEstate.src,
        width: DEFAULT_COVERS.realEstate.width,
        height: DEFAULT_COVERS.realEstate.height,
      },
    }));
  } catch (error) {
    console.error('Real Estate kategorileri yüklenemedi:', error);
    return [];
  }
}

export async function getRealEstateCategoryByHandle(handle?: string) {
  if (!handle || handle === 'all') {
    return {
      id: 'real-estate://all',
      name: 'Real-estates',
      handle: 'all',
      href: '/real-estate-categories/all',
      count: 20000,
      thumbnail: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
      coverImage: {
        src: DEFAULT_COVERS.realEstate.src,
        width: DEFAULT_COVERS.realEstate.width,
        height: DEFAULT_COVERS.realEstate.height,
      },
      region: 'Worldwide',
      description: 'Explore all real estates around the world',
    }
  }

  try {
    const category = await categoryService.getBySlug(handle.toLowerCase(), HIZMET_IDS.REAL_ESTATE);
    return {
      ...categoryService.formatCategory(category, 'real-estate'),
      coverImage: category.kapak_gorseli ? {
        src: category.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.realEstate.src,
        width: DEFAULT_COVERS.realEstate.width,
        height: DEFAULT_COVERS.realEstate.height,
      },
    };
  } catch (error) {
    console.error('Real Estate kategori bulunamadı:', error);
    return undefined;
  }
}

// ===== CAR CATEGORIES =====
export async function getCarCategories() {
  try {
    const categories = await categoryService.getByHizmetId(HIZMET_IDS.CAR);
    return categories.map(cat => ({
      ...categoryService.formatCategory(cat, 'car'),
      coverImage: cat.kapak_gorseli ? {
        src: cat.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.car.src,
        width: DEFAULT_COVERS.car.width,
        height: DEFAULT_COVERS.car.height,
      },
    }));
  } catch (error) {
    console.error('Car kategorileri yüklenemedi:', error);
    return [];
  }
}

export async function getCarCategoryByHandle(handle?: string) {
  if (!handle || handle === 'all') {
    return {
      id: 'car://all',
      name: 'Car rentals',
      handle: 'all',
      href: '/car-categories/all',
      count: 3000,
      thumbnail: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
      coverImage: {
        src: DEFAULT_COVERS.car.src,
        width: DEFAULT_COVERS.car.width,
        height: DEFAULT_COVERS.car.height,
      },
      region: 'Worldwide',
      description: 'Explore all cars around the world',
    }
  }

  try {
    const category = await categoryService.getBySlug(handle.toLowerCase(), HIZMET_IDS.CAR);
    return {
      ...categoryService.formatCategory(category, 'car'),
      coverImage: category.kapak_gorseli ? {
        src: category.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.car.src,
        width: DEFAULT_COVERS.car.width,
        height: DEFAULT_COVERS.car.height,
      },
    };
  } catch (error) {
    console.error('Car kategori bulunamadı:', error);
    return undefined;
  }
}

// ===== FLIGHT CATEGORIES =====
export async function getFlightCategories() {
  try {
    const categories = await categoryService.getByHizmetId(HIZMET_IDS.FLIGHT);
    return categories.map(cat => ({
      ...categoryService.formatCategory(cat, 'flight'),
      coverImage: cat.kapak_gorseli ? {
        src: cat.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.flight.src,
        width: DEFAULT_COVERS.flight.width,
        height: DEFAULT_COVERS.flight.height,
      },
    }));
  } catch (error) {
    console.error('Flight kategorileri yüklenemedi:', error);
    return [];
  }
}

export async function getFlightCategoryByHandle(handle?: string) {
  if (!handle || handle === 'all') {
    return {
      id: 'flight://all',
      name: 'Book Flights',
      handle: 'all',
      href: '/flight-categories/all',
      count: 3000,
      thumbnail: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
      coverImage: {
        src: DEFAULT_COVERS.flight.src,
        width: DEFAULT_COVERS.flight.width,
        height: DEFAULT_COVERS.flight.height,
      },
      region: 'Worldwide',
      description: 'Explore all flights around the world',
    }
  }

  try {
    const category = await categoryService.getBySlug(handle.toLowerCase(), HIZMET_IDS.FLIGHT);
    return {
      ...categoryService.formatCategory(category, 'flight'),
      coverImage: category.kapak_gorseli ? {
        src: category.kapak_gorseli,
        width: 1000,
        height: 800,
      } : {
        src: DEFAULT_COVERS.flight.src,
        width: DEFAULT_COVERS.flight.width,
        height: DEFAULT_COVERS.flight.height,
      },
    };
  } catch (error) {
    console.error('Flight kategori bulunamadı:', error);
    return undefined;
  }
}

// Types
export type TStayCategory = Awaited<ReturnType<typeof getStayCategories>>[number]
export type TExperienceCategory = Awaited<ReturnType<typeof getExperienceCategories>>[number]
export type TCarCategory = Awaited<ReturnType<typeof getCarCategories>>[number]
export type TRealEstateCategory = Awaited<ReturnType<typeof getRealEstateCategories>>[number]
export type TFlightCategory = Awaited<ReturnType<typeof getFlightCategories>>[number]
export type TCategory = TStayCategory | TExperienceCategory | TCarCategory | TRealEstateCategory | TFlightCategory

