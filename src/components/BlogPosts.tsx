import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { supabase, BlogPost, deleteImages } from '../lib/supabase';
import MultipleImageUpload from './MultipleImageUpload';

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    content: '',
    images: [],
    published_at: '',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const postData = {
        ...formData,
        published_at: formData.published_at || null,
        updated_at: new Date().toISOString(),
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        
        if (error) throw error;
      }

      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;

    try {
      // Prima ottieni l'articolo per recuperare le immagini
      const { data: post, error: fetchError } = await supabase
        .from('blog_posts')
        .select('images')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching blog post for deletion:', fetchError);
        // Continua comunque con l'eliminazione
      }

      // Delete the blog post from database
      // Elimina prima le immagini dallo storage se esistono
      if (post?.images && post.images.length > 0) {
        try {
          await deleteImages(post.images);
          console.log('Images deleted from storage:', post.images.length);
        } catch (imageError) {
          console.error('Error deleting images from storage:', imageError);
          // Non bloccare l'eliminazione dell'articolo per errori immagini
        }
      }

      // Poi elimina l'articolo dal database
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Errore durante l\'eliminazione dell\'articolo');
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const published_at = post.published_at ? null : new Date().toISOString();
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ published_at, updated_at: new Date().toISOString() })
        .eq('id', post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      images: [],
      published_at: '',
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const startEdit = (post: BlogPost) => {
    setFormData({
      ...post,
      images: post.images || [],
      published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
    });
    setEditingPost(post);
    setShowForm(true);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articoli Blog</h1>
          <p className="text-gray-600 mt-1">Gestisci i contenuti del blog</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Articolo
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Cerca articoli..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Immagini dell'articolo */}
            {post.images && post.images.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto">
                  {post.images.map((imageUrl, index) => (
                    <img 
                      key={index}
                      src={imageUrl} 
                      alt={`${post.title} - Immagine ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                {post.content && (
                  <p className="text-gray-700 line-clamp-3 mb-3">
                    {post.content.substring(0, 200)}...
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  post.published_at 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.published_at ? 'Pubblicato' : 'Bozza'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <div className="space-y-1">
                <div>Creato: {new Date(post.created_at!).toLocaleDateString()}</div>
                {post.published_at && (
                  <div>Pubblicato: {new Date(post.published_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(post)}
                  className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifica
                </button>
                <button
                  onClick={() => togglePublish(post)}
                  className={`flex items-center px-3 py-1 rounded transition-colors ${
                    post.published_at
                      ? 'text-orange-600 hover:bg-orange-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {post.published_at ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Ritira
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Pubblica
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(post.id!)}
                  className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingPost ? 'Modifica Articolo' : 'Nuovo Articolo'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto</label>
                  <textarea
                    rows={12}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Scrivi il contenuto dell'articolo..."
                  />
                </div>

                <MultipleImageUpload
                  currentImages={formData.images}
                  onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
                  folder="blog"
                  maxImages={3}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data pubblicazione (lascia vuoto per salvare come bozza)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.published_at || ''}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    {editingPost ? 'Aggiorna' : 'Crea'}
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