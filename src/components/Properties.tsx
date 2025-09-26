import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Search, Share2, Facebook, Mail } from 'lucide-react';
import { supabase, Property, deleteImages } from '../lib/supabase';
import MultipleImageUpload from './MultipleImageUpload';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shareDropdown, setShareDropdown] = useState<string | null>(null);
  const [formData, setFormData] = useState<Property>({
    title: '',
    description: '',
    price: 0,
    city: '',
    province: '',
    property_type: '',
    rooms: 0,
    bathrooms: 0,
    square_meters: 0,
    features: '',
    energy_class: '',
    images: [],
    is_featured: false,
    listing_type: 'vendita',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('💾 Salvataggio proprietà con dati:', {
      title: formData.title,
      listing_type: formData.listing_type,
      price: formData.price
    });

    try {
      // Prepara i dati per il salvataggio
      const propertyData = {
        ...formData,
        listing_type: formData.listing_type || 'vendita', // Fallback sicuro
        updated_at: new Date().toISOString()
      };

      console.log('📤 Invio al database:', propertyData);

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);
        
        if (error) {
          console.error('❌ Errore aggiornamento:', error);
          throw error;
        }
        console.log('✅ Proprietà aggiornata con successo');
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);
        
        if (error) {
          console.error('❌ Errore inserimento:', error);
          throw error;
        }
        console.log('✅ Proprietà creata con successo');
      }

      fetchProperties();
      resetForm();
      alert('✅ Proprietà salvata con successo!');
    } catch (error) {
      console.error('Error saving property:', error);
      alert('❌ Errore durante il salvataggio: ' + (error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa proprietà?')) return;

    try {
      // Prima ottieni la proprietà per recuperare le immagini
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('images')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching property for deletion:', fetchError);
        // Continua comunque con l'eliminazione
      }

      // Delete the property from database
      // Elimina prima le immagini dallo storage se esistono
      if (property?.images && property.images.length > 0) {
        try {
          await deleteImages(property.images);
          console.log('Images deleted from storage:', property.images.length);
        } catch (imageError) {
          console.error('Error deleting images from storage:', imageError);
          // Non bloccare l'eliminazione della proprietà per errori immagini
        }
      }

      // Poi elimina la proprietà dal database
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Errore durante l\'eliminazione della proprietà');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      listing_type: 'vendita',
      city: '',
      province: '',
      property_type: '',
      rooms: 0,
      bathrooms: 0,
      square_meters: 0,
      features: '',
      energy_class: '',
      images: [],
      is_featured: false,
    });
    setEditingProperty(null);
    setShowForm(false);
  };

  const startEdit = (property: Property) => {
    setFormData({
      ...property,
      listing_type: property.listing_type || 'vendita'
    });
    setEditingProperty(property);
    setShowForm(true);
  };

  const shareProperty = (property: Property, platform: 'whatsapp' | 'email' | 'facebook') => {
    const url = `${window.location.origin}/property/${property.id}`;
    const text = `Guarda questa proprietà: ${property.title} - €${property.price?.toLocaleString()}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`);
        break;
    }
    setShareDropdown(null);
  };

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.province?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestione Proprietà</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Nuova Proprietà</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Cerca proprietà..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {property.images && property.images.length > 0 && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {property.title}
                </h3>
                {property.is_featured && (
                  <Star className="h-5 w-5 text-yellow-500 fill-current ml-2" />
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-blue-600">
                  {property.price ? `€${property.price.toLocaleString()}` : 'Prezzo da concordare'}
                  {property.listing_type === 'affitto' && '/mese'}
                </p>
                
                <p className="capitalize">
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2">
                    {property.listing_type}
                  </span>
                  {property.property_type}
                </p>
                
                {(property.city || property.province) && (
                  <p>📍 {[property.city, property.province].filter(Boolean).join(', ')}</p>
                )}
                
                {(property.rooms > 0 || property.bathrooms > 0 || property.square_meters > 0) && (
                  <div className="flex space-x-4 text-xs">
                    {property.rooms > 0 && <span>🏠 {property.rooms} vani</span>}
                    {property.bathrooms > 0 && <span>🚿 {property.bathrooms} bagni</span>}
                    {property.square_meters > 0 && <span>📐 {property.square_meters}m²</span>}
                  </div>
                )}
                
                {property.energy_class && (
                  <p className="text-xs">⚡ Classe energetica: {property.energy_class}</p>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(property)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifica"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(property.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Elimina"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setShareDropdown(shareDropdown === property.id ? null : property.id!)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Condividi"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  
                  {shareDropdown === property.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => shareProperty(property, 'facebook')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                          Facebook
                        </button>
                        <button
                          onClick={() => shareProperty(property, 'whatsapp')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                        >
                          <span className="mr-3 text-green-600">📱</span>
                          WhatsApp
                        </button>
                        <button
                          onClick={() => shareProperty(property, 'email')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Mail className="h-4 w-4 mr-3 text-gray-600" />
                          Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingProperty ? 'Modifica Proprietà' : 'Nuova Proprietà'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Annuncio</label>
                  <select
                    value={formData.listing_type}
                    onChange={(e) => {
                      console.log('🔄 Cambio listing_type da', formData.listing_type, 'a', e.target.value);
                      setFormData({ ...formData, listing_type: e.target.value as 'vendita' | 'affitto' });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="vendita">Vendita</option>
                    <option value="affitto">Affitto</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Attualmente selezionato: <strong>{formData.listing_type}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prezzo (€) {formData.listing_type === 'affitto' && '- mensile'}
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.listing_type === 'affitto' ? 'Prezzo mensile' : 'Prezzo di vendita'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Città</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                    <input
                      type="text"
                      value={formData.province || ''}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo di Proprietà</label>
                  <select
                    value={formData.property_type || ''}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleziona tipo di proprietà</option>
                    <option value="Appartamento">Appartamento</option>
                    <option value="Villa">Villa</option>
                    <option value="Ufficio">Ufficio</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Deposito">Deposito</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numero di vani</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.rooms || ''}
                      onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numero di bagni</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bathrooms || ''}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metratura (m²)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.square_meters || ''}
                      onChange={(e) => setFormData({ ...formData, square_meters: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe Energetica</label>
                  <select
                    value={formData.energy_class || ''}
                    onChange={(e) => setFormData({ ...formData, energy_class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleziona classe energetica</option>
                    <option value="A+">Classe A+</option>
                    <option value="A">Classe A</option>
                    <option value="B">Classe B</option>
                    <option value="C">Classe C</option>
                    <option value="D">Classe D</option>
                    <option value="E">Classe E</option>
                    <option value="F">Classe F</option>
                    <option value="G">Classe G</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Must della proprietà</label>
                  <input
                    type="text"
                    value={formData.features || ''}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Es: Balcone, Garage, Giardino, Vista mare..."
                  />
                </div>

                <MultipleImageUpload
                  currentImages={formData.images}
                  onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
                  folder="properties"
                  maxImages={15}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured || false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Proprietà in evidenza
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingProperty ? 'Aggiorna' : 'Crea'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}