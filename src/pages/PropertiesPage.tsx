import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Building, Euro, Bed, Bath, Square, Star, ArrowLeft, Grid, List, X, Zap, Menu } from 'lucide-react';
import { supabase, Property } from '../lib/supabase';
import Footer from '../components/Footer';

interface PropertiesPageProps {
  onNavigate: (view: string, id?: string) => void;
}

interface PropertyFilters {
  search: string;
  listingType: 'vendita' | 'affitto' | '';
  propertyType: string;
  city: string;
  province: string;
  minPrice: number;
  maxPrice: number;
  minRooms: number;
  maxRooms: number;
  minBathrooms: number;
  maxBathrooms: number;
  minSquareMeters: number;
  maxSquareMeters: number;
  energyClass: string;
  featuredOnly: boolean;
  features: string;
}

const initialFilters: PropertyFilters = {
  search: '',
  listingType: '',
  propertyType: '',
  city: '',
  province: '',
  minPrice: 0,
  maxPrice: 0,
  minRooms: 0,
  maxRooms: 0,
  minBathrooms: 0,
  maxBathrooms: 0,
  minSquareMeters: 0,
  maxSquareMeters: 0,
  energyClass: '',
  featuredOnly: false,
  features: '',
};

export default function PropertiesPage({ onNavigate }: PropertiesPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProperties();
  }, []);

  // Separato useEffect per gestire i filtri dalla homepage
  useEffect(() => {
    const applySearchFilters = () => {
      // Controlla se ci sono filtri di ricerca dal sessionStorage
      const savedFilters = sessionStorage.getItem('searchFilters');
      console.log('Checking for saved filters:', savedFilters);
      
      if (savedFilters) {
        try {
          const searchFilters = JSON.parse(savedFilters);
          console.log('Parsed search filters:', searchFilters);
          
          const newFilters = { ...initialFilters };
          
          // Applica i filtri dalla ricerca
          if (searchFilters.listingType) {
            newFilters.listingType = searchFilters.listingType;
          }
          if (searchFilters.location) {
            newFilters.search = searchFilters.location;
            newFilters.city = searchFilters.location;
          }
          if (searchFilters.propertyType) {
            newFilters.propertyType = searchFilters.propertyType;
          }
          if (searchFilters.minPrice > 0) {
            newFilters.minPrice = searchFilters.minPrice;
          }
          if (searchFilters.maxPrice > 0) {
            newFilters.maxPrice = searchFilters.maxPrice;
          }
          
          console.log('Applying filters:', newFilters);
          setFilters(newFilters);
          
          // Rimuovi i filtri dal sessionStorage dopo averli applicati
          sessionStorage.removeItem('searchFilters');
        } catch (error) {
          console.error('Error parsing search filters:', error);
        }
      }
    };

    // Applica i filtri dopo un breve delay per assicurarsi che le proprietà siano caricate
    const timer = setTimeout(applySearchFilters, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('Applying filters to properties:', filters);
    console.log('Total properties:', properties.length);
    applyFilters();
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setProperties([]);
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log('Starting filter application...');
    let filtered = properties.filter(property => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower) ||
          property.city?.toLowerCase().includes(searchLower) ||
          property.province?.toLowerCase().includes(searchLower) ||
          property.features?.toLowerCase().includes(searchLower);
        console.log(`Search filter for "${filters.search}": ${matchesSearch} (${property.title})`);
        if (!matchesSearch) return false;
      }

      // Listing type filter
      if (filters.listingType && property.listing_type !== filters.listingType) {
        console.log(`Listing type filter: ${property.listing_type} !== ${filters.listingType}`);
        return false;
      }

      // Property type filter
      if (filters.propertyType && property.property_type !== filters.propertyType) {
        console.log(`Property type filter: ${property.property_type} !== ${filters.propertyType}`);
        return false;
      }

      // City filter
      if (filters.city && !property.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;

      // Province filter
      if (filters.province && !property.province?.toLowerCase().includes(filters.province.toLowerCase())) return false;

      // Price filters
      if (filters.minPrice > 0 && (!property.price || property.price < filters.minPrice)) return false;
      if (filters.maxPrice > 0 && (!property.price || property.price > filters.maxPrice)) return false;

      // Rooms filters
      if (filters.minRooms > 0 && (!property.rooms || property.rooms < filters.minRooms)) return false;
      if (filters.maxRooms > 0 && (!property.rooms || property.rooms > filters.maxRooms)) return false;

      // Bathrooms filters
      if (filters.minBathrooms > 0 && (!property.bathrooms || property.bathrooms < filters.minBathrooms)) return false;
      if (filters.maxBathrooms > 0 && (!property.bathrooms || property.bathrooms > filters.maxBathrooms)) return false;

      // Square meters filters
      if (filters.minSquareMeters > 0 && (!property.square_meters || property.square_meters < filters.minSquareMeters)) return false;
      if (filters.maxSquareMeters > 0 && (!property.square_meters || property.square_meters > filters.maxSquareMeters)) return false;

      // Energy class filter
      if (filters.energyClass && property.energy_class !== filters.energyClass) return false;

      // Featured only filter
      if (filters.featuredOnly && !property.is_featured) return false;

      // Features filter
      if (filters.features && (!property.features || !property.features.toLowerCase().includes(filters.features.toLowerCase()))) return false;
      return true;
    });

    console.log(`Filtered ${filtered.length} properties from ${properties.length} total`);
    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const propertyTypes = [
    'Tutti i tipi',
    'Appartamento',
    'Villa', 
    'Ufficio',
    'Terreno',
    'Deposito',
    'Altro'
  ];

  const energyClasses = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => onNavigate('home')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => onNavigate('home')} className="flex items-center">
                <img 
                  src="/logoalessio.png" 
                  alt="Ferrise Immobiliare" 
                  className="h-10 w-auto hover:opacity-80 transition-opacity"
                />
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button className="text-blue-600 px-3 py-2 text-sm font-medium">
                Proprietà
              </button>
              <button 
                onClick={() => onNavigate('agency')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Agenzia
              </button>
              <button 
                onClick={() => onNavigate('blog')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Blog
              </button>
              <button 
                onClick={() => onNavigate('faq')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contatti
              </button>
            </nav>
          </div>
          
          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Home
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 px-3 py-2 text-base font-medium text-left"
                >
                  Proprietà
                </button>
                <button 
                  onClick={() => {
                    onNavigate('agency');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Agenzia
                </button>
                <button 
                  onClick={() => {
                    onNavigate('blog');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Blog
                </button>
                <button 
                  onClick={() => {
                    onNavigate('faq');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => {
                    onNavigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Contatti
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Le Nostre Proprietà
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Esplora il nostro catalogo di immobili e trova la soluzione perfetta per le tue esigenze
            </p>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Filtri
                </h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ricerca</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cerca..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contratto</label>
                  <select
                    value={filters.listingType}
                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tutti i contratti</option>
                    <option value="vendita">Vendita</option>
                    <option value="affitto">Affitto</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipologia</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type === 'Tutti i tipi' ? '' : type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
                  <input
                    type="text"
                    placeholder="Es. Lamezia Terme"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                  <input
                    type="text"
                    placeholder="Es. CZ"
                    value={filters.province}
                    onChange={(e) => handleFilterChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Euro className="w-4 h-4 inline mr-1" />
                    Range di Prezzo (€)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bed className="w-4 h-4 inline mr-1" />
                    Numero di Vani
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={filters.minRooms || ''}
                      onChange={(e) => handleFilterChange('minRooms', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={filters.maxRooms || ''}
                      onChange={(e) => handleFilterChange('maxRooms', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Filtra per numero di vani/locali
                  </p>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bath className="w-4 h-4 inline mr-1" />
                    Numero di Bagni
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={filters.minBathrooms || ''}
                      onChange={(e) => handleFilterChange('minBathrooms', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={filters.maxBathrooms || ''}
                      onChange={(e) => handleFilterChange('maxBathrooms', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Filtra per numero di bagni
                  </p>
                </div>

                {/* Square Meters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Square className="w-4 h-4 inline mr-1" />
                    Range Metri Quadri (m²)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min m²"
                      min="0"
                      value={filters.minSquareMeters || ''}
                      onChange={(e) => handleFilterChange('minSquareMeters', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max m²"
                      min="0"
                      value={filters.maxSquareMeters || ''}
                      onChange={(e) => handleFilterChange('maxSquareMeters', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Superficie commerciale dell'immobile
                  </p>
                </div>

                {/* Energy Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Zap className="w-4 h-4 inline mr-1 text-green-600" />
                    Classe Energetica
                  </label>
                  <select
                    value={filters.energyClass}
                    onChange={(e) => handleFilterChange('energyClass', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tutte le classi</option>
                    {energyClasses.map((cls) => (
                      <option key={cls} value={cls}>Classe {cls}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Efficienza energetica dell'immobile
                  </p>
                </div>

                {/* Quick Filters */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Filtri Rapidi</h3>
                  <div className="space-y-3">
                    {/* Featured Only */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.featuredOnly}
                          onChange={(e) => handleFilterChange('featuredOnly', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Solo In Evidenza
                        </span>
                      </label>
                    </div>

                    {/* Price Ranges Quick Select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Range Prezzo Rapido</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleFilterChange('minPrice', 0);
                            handleFilterChange('maxPrice', 100000);
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          &lt; 100k
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleFilterChange('minPrice', 100000);
                            handleFilterChange('maxPrice', 200000);
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          100k-200k
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleFilterChange('minPrice', 200000);
                            handleFilterChange('maxPrice', 300000);
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          200k-300k
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleFilterChange('minPrice', 300000);
                            handleFilterChange('maxPrice', 0);
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        >
                          &gt; 300k
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Features Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caratteristiche</label>
                  <input
                    type="text"
                    placeholder="Es. Balcone, Garage, Giardino..."
                    value={filters.features}
                    onChange={(e) => handleFilterChange('features', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cerca per caratteristiche specifiche dell'immobile
                  </p>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-3">
              {/* Mobile Filters Toggle & View Mode */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtri
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'risultato' : 'risultati'}
                  </div>
                </div>
                
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Results */}
              {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessuna proprietà trovata</h3>
                  <p className="text-gray-600 mb-6">
                    Prova a modificare i filtri di ricerca per ampliare i risultati
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Filtri
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-6'
                }>
                  {filteredProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                      onClick={() => onNavigate('property-detail', property.id)}
                    >
                      {property.images && property.images.length > 0 && (
                        <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className={`object-cover ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              property.listing_type === 'vendita' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {property.listing_type === 'vendita' ? 'Vendita' : 'Affitto'}
                            </span>
                          </div>
                          {property.is_featured && (
                            <div className="absolute top-4 right-4">
                              <Star className="w-6 h-6 text-yellow-400 fill-current" />
                            </div>
                          )}
                          {property.images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              +{property.images.length - 1} foto
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                        
                        {property.price && (
                          <p className="text-2xl font-bold text-blue-600 mb-3">
                            €{property.price.toLocaleString()}
                            {property.listing_type === 'affitto' && '/mese'}
                          </p>
                        )}
                        
                        {(property.city || property.province) && (
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {property.city}{property.city && property.province && ', '}{property.province}
                            </span>
                          </div>
                        )}

                        {property.description && (
                          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{property.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.property_type && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {property.property_type}
                            </span>
                          )}
                          {property.rooms && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {property.rooms} vani
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {property.bathrooms} bagni
                            </span>
                          )}
                          {property.square_meters && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              {property.square_meters} m²
                            </span>
                          )}
                          {property.energy_class && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Classe {property.energy_class}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowMobileFilters(false)}
      >
        <div 
          className={`fixed right-0 top-0 h-full bg-white w-full max-w-xs p-6 transform transition-transform duration-300 overflow-y-auto ${
            showMobileFilters ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Filtri
            </h2>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Mobile filters - same structure as desktop but with mobile- prefixed IDs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ricerca</label>
              <input
                type="text"
                placeholder="Cerca..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contratto</label>
              <select
                value={filters.listingType}
                onChange={(e) => handleFilterChange('listingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutti i contratti</option>
                <option value="vendita">Vendita</option>
                <option value="affitto">Affitto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipologia</label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type === 'Tutti i tipi' ? '' : type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
              <input
                type="text"
                placeholder="Es. Lamezia Terme"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vani</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={filters.minRooms || ''}
                  onChange={(e) => handleFilterChange('minRooms', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={filters.maxRooms || ''}
                  onChange={(e) => handleFilterChange('maxRooms', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bagni</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={filters.minBathrooms || ''}
                  onChange={(e) => handleFilterChange('minBathrooms', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={filters.maxBathrooms || ''}
                  onChange={(e) => handleFilterChange('maxBathrooms', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metri Quadri</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min m²"
                  min="0"
                  value={filters.minSquareMeters || ''}
                  onChange={(e) => handleFilterChange('minSquareMeters', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max m²"
                  min="0"
                  value={filters.maxSquareMeters || ''}
                  onChange={(e) => handleFilterChange('maxSquareMeters', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classe Energetica</label>
              <select
                value={filters.energyClass}
                onChange={(e) => handleFilterChange('energyClass', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tutte le classi</option>
                {energyClasses.map((cls) => (
                  <option key={cls} value={cls}>Classe {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.featuredOnly}
                  onChange={(e) => handleFilterChange('featuredOnly', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  Solo In Evidenza
                </span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caratteristiche</label>
              <input
                type="text"
                placeholder="Es. Balcone, Garage..."
                value={filters.features}
                onChange={(e) => handleFilterChange('features', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="pt-4 flex space-x-3">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Applica Filtri
              </button>
              
              <button 
                onClick={clearFilters}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}