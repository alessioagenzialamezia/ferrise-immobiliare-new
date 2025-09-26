import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Eye, Users, Calendar, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PageView {
  id: string;
  page_path: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  created_at: string;
}

interface AnalyticsSummary {
  page_path: string;
  total_views: number;
  unique_visitors: number;
  view_date: string;
  last_view: string;
}

export default function Analytics() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    totalPages: 0,
    topPage: '',
  });

  useEffect(() => {
    fetchPageViews();
    fetchSummary();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [pageViews, summary]);

  const fetchPageViews = async () => {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setPageViews(data || []);
    } catch (error) {
      console.error('Error fetching page views:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('*')
        .order('total_views', { ascending: false });

      if (error) throw error;
      setSummary(data || []);
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
    }
  };

  const calculateStats = () => {
    const totalViews = pageViews.length;
    const uniqueVisitors = new Set(pageViews.map(view => view.ip_address)).size;
    const uniquePages = new Set(pageViews.map(view => view.page_path)).size;
    const topPageData = summary.length > 0 ? summary[0] : null;
    const topPage = topPageData ? topPageData.page_path : '';

    setStats({
      totalViews,
      uniqueVisitors,
      totalPages: uniquePages,
      topPage,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchPageViews(), fetchSummary()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleResetData = async () => {
    // Prima conferma
    if (!confirm('⚠️ ATTENZIONE: Questa azione eliminerà TUTTI i dati di analytics in modo PERMANENTE.\n\nTutte le visualizzazioni, statistiche e dati di tracciamento verranno cancellati definitivamente dal database.\n\nSei sicuro di voler continuare?')) {
      return;
    }

    // Seconda conferma
    if (!confirm('🚨 ULTIMA CONFERMA: Stai per eliminare TUTTI i dati analytics dal database Supabase.\n\nQuesta operazione è IRREVERSIBILE!\n\nClicca OK per confermare o Annulla per fermare.')) {
      return;
    }

    setResetting(true);
    try {
      console.log('🗑️ Inizio eliminazione dati analytics...');
      
      // Reset immediato dello stato locale PRIMA dell'operazione database
      console.log('🔄 Reset immediato stato locale...');
      setPageViews([]);
      setSummary([]);
      setStats({
        totalViews: 0,
        uniqueVisitors: 0,
        totalPages: 0,
        topPage: '',
      });
      
      // Prima verifica quanti record ci sono
      const { count: initialCount, error: countError } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Errore nel conteggio iniziale:', countError);
      } else {
        console.log(`📊 Record da eliminare: ${initialCount}`);
      }

      // Elimina TUTTI i page views dal database
      const { error: deleteError } = await supabase
        .from('page_views')
        .delete()
        .gte('created_at', '1900-01-01'); // Elimina tutti i record dalla data 1900 in poi

      if (deleteError) {
        console.error('❌ Errore eliminazione page_views:', deleteError);
        throw deleteError;
      }

      // Verifica che l'eliminazione sia avvenuta
      const { count: finalCount, error: finalCountError } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      
      if (finalCountError) {
        console.error('Errore nel conteggio finale:', finalCountError);
      } else {
        console.log(`✅ Record rimanenti dopo eliminazione: ${finalCount}`);
      }

      console.log('🔄 Conferma reset con ricarica dal database...');
      
      // Forza il ricaricamento dei dati dal database per confermare
      await Promise.all([
        fetchPageViews(),
        fetchSummary()
      ]);
      
      // Forza il ricalcolo delle statistiche
      setTimeout(() => {
        calculateStats();
      }, 100);
      
      console.log('✅ Reset completato!');
      
      alert(`✅ Reset completato con successo!\n\nTutti i dati analytics sono stati eliminati:\n• Record eliminati dal database: ${initialCount || 'N/A'}\n• Record rimanenti: ${finalCount || 0}\n\n📊 Dashboard azzerata:\n• Visualizzazioni totali: 0\n• Visitatori unici: 0\n• Pagine visitate: 0\n• Pagina top: nessuna\n• Grafici: vuoti\n• Tabelle: vuote\n\nLa dashboard è stata completamente inizializzata!`);
    } catch (error) {
      console.error('Error resetting analytics data:', error);
      alert('❌ Errore durante il reset dei dati dal database.\n\nDettagli: ' + (error as Error).message + '\n\nControlla la console per maggiori dettagli e riprova.');
      
      // In caso di errore, ricarica i dati per ripristinare lo stato corretto
      await Promise.all([
        fetchPageViews(),
        fetchSummary()
      ]);
    } finally {
      setResetting(false);
    }
  };

  const getPageTypeIcon = (path: string) => {
    if (path.includes('/proprieta') || path.includes('/property')) {
      return <Globe className="w-4 h-4 text-blue-500" />;
    } else if (path.includes('/blog')) {
      return <Calendar className="w-4 h-4 text-green-500" />;
    } else if (path.includes('/faq')) {
      return <Users className="w-4 h-4 text-orange-500" />;
    }
    return <Eye className="w-4 h-4 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupViewsByDate = () => {
    const grouped = pageViews.reduce((acc, view) => {
      const date = new Date(view.created_at).toLocaleDateString('it-IT');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 7);
  };

  const dailyViews = groupViewsByDate();

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Sito Web</h1>
          <p className="text-gray-600 mt-1">Monitora le visite al tuo sito web</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Aggiorna Dati
          </button>
          <button
            onClick={handleResetData}
            disabled={resetting || refreshing}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Eliminazione...' : 'Reset Dati'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Visualizzazioni Totali</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Visitatori Unici</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueVisitors}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pagine Visitate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPages}</p>
            </div>
            <Globe className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pagina Top</p>
              <p className="text-lg font-bold text-gray-900 truncate" title={stats.topPage}>
                {stats.topPage || 'N/A'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Daily Views Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualizzazioni Giornaliere (Ultimi 7 giorni)</h3>
        {dailyViews.length > 0 ? (
          <div className="space-y-3">
            {dailyViews.map(([date, views]) => (
              <div key={date} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{date}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{
                        width: dailyViews.length > 0 
                          ? `${(views / Math.max(...dailyViews.map(([, v]) => v))) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900">{views}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nessuna visualizzazione registrata</p>
          </div>
        )}
      </div>

      {/* Pages Summary */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pagine Più Visitate</h3>
        </div>
        <div className="overflow-x-auto">
          {summary.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visualizzazioni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitatori Unici
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ultima Visita
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.slice(0, 10).map((item, index) => (
                  <tr key={`${item.page_path}-${item.view_date}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPageTypeIcon(item.page_path)}
                        <div className="ml-2 text-sm font-medium text-gray-900">{item.page_path}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 mr-2">{item.total_views.toLocaleString()}</div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{
                              width: summary.length > 0 
                                ? `${(item.total_views / Math.max(...summary.map(s => s.total_views))) * 100}%`
                                : '0%'
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.unique_visitors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.last_view)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nessun dato di riepilogo disponibile</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Page Views */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Visualizzazioni Recenti</h3>
        </div>
        <div className="overflow-x-auto">
          {pageViews.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Ora
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageViews.slice(0, 20).map((view, index) => (
                  <tr key={view.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPageTypeIcon(view.page_path)}
                        <div className="ml-2 text-sm font-medium text-gray-900">{view.page_path}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {view.ip_address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {view.referrer || 'Diretto'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(view.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nessuna visualizzazione recente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}