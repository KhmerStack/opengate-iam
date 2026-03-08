'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { apiFetch, getUser, isAuthenticated } from '@/lib/auth';
import { Package, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface Product { id: string; name: string; price: number; category: string; }

export default function ProductsPage() {
  const router  = useRouter();
  const [data, setData]       = useState<{ products: Product[]; requestedBy: string; realm: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const user = getUser();
  const isAdmin = user?.roles?.includes('admin');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    apiFetch('/api/products')
      .then(setData)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    setData(d => d ? { ...d, products: d.products.filter(p => p.id !== id) } : d);
  };

  const handleCreate = async () => {
    const name = prompt('Product name:');
    if (!name) return;
    const price = parseFloat(prompt('Price:') ?? '0');
    const product = await apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({ name, price, category: 'General' }),
    });
    setData(d => d ? { ...d, products: [...d.products, product] } : d);
  };

  const categories = [...new Set(data?.products.map(p => p.category) ?? [])];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-0.5">
                {data.products.length} items · realm: <span className="font-medium">{data.realm}</span>
                {' '}· as <span className="font-medium">{data.requestedBy}</span>
              </p>
            )}
          </div>
          {isAdmin && (
            <button onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: '#00B4D8' }}>
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>

        {/* Role badge */}
        <div className="flex gap-2 mb-6">
          {user?.roles?.map((r: string) => (
            <span key={r} className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: r === 'admin' ? '#0D1B2A' : '#e0f7fc', color: r === 'admin' ? '#00B4D8' : '#0D1B2A' }}>
              {r}
            </span>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
        )}

        {/* Product grid */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: '#f0fafd' }}>
                    <Package size={20} style={{ color: '#00B4D8' }} />
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                <p className="text-xl font-bold mt-3" style={{ color: '#00B4D8' }}>
                  ${p.price.toFixed(2)}
                </p>
                <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-gray-200 hover:border-cyan-400 hover:text-cyan-600 transition-colors">
                  <ShoppingCart size={13} /> Add to cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No admin notice */}
        {!isAdmin && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            You are viewing as a <strong>user</strong>. Admin role is required to add or delete products.
          </div>
        )}
      </div>
    </div>
  );
}
