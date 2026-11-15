import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { FlavorVariant, Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  onSelectProduct: (product: Product, flavorId: string) => void;
  onQuickAdd: (product: Product, flavor: FlavorVariant) => void;
}

type FilterOption = 'all' | ProductCategory;
type SortOption = 'featured' | 'protein-desc' | 'calories-asc' | 'price-asc';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onQuickAdd,
}) => {
  const [category, setCategory] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [query, setQuery] = useState('');

  const categories: { id: FilterOption; label: string }[] = [
    { id: 'all', label: 'All Drops' },
    { id: 'shakes', label: 'Protein Shakes' },
    { id: 'bars', label: 'Crunch Bars' },
    { id: 'bites', label: 'Power Bites' },
    { id: 'packs', label: 'Variety Packs' },
  ];

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      const matchesCat = category === 'all' || p.category === category;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.flavors.some((f) => f.name.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'protein-desc') {
      return [...list].sort((a, b) => b.macros.proteinG - a.macros.proteinG);
    }
    if (sortBy === 'calories-asc') {
      return [...list].sort((a, b) => a.macros.calories - b.macros.calories);
    }
    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.packOptions[0].price - b.packOptions[0].price);
    }
    return list;
  }, [category, query, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#2a292f] pb-6">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.1em] text-[#CCFF00]">
            FULL ARSENAL · BATCH 2026
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white mt-1">
            Shakes, Crunch Bars & Bites
          </h1>
        </div>
        <p className="font-body text-sm sm:text-base text-[#c4c9ac] max-w-md">
          Switch flavors directly on any card to preview macro profiles, or open Specs for full
          nutritional telemetry.
        </p>
      </div>

      {/* Filter Tabs + Search + Sort Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#16161D] border-2 border-[#2E29FF] rounded-xl p-4 neo-shadow-dark">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Product Categories">
          {categories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-2 rounded font-label text-xs uppercase tracking-[0.06em] border-2 transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#CCFF00] text-[#111116] border-[#111116] shadow-[3px_3px_0px_#FF007F] font-bold'
                    : 'bg-[#111116] text-[#e4e1e9] border-[#2a292f] hover:border-[#2E29FF]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#8e9379] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flavor or product..."
              aria-label="Search flavor or product"
              className="w-full sm:w-56 pl-9 pr-3 py-2 rounded bg-[#111116] border-2 border-[#2E29FF] text-sm text-white placeholder-[#8e9379] focus:outline-none focus:border-[#CCFF00] focus:shadow-[0_0_12px_rgba(204,255,0,0.3)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#CCFF00] shrink-0" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort products"
              className="px-3 py-2 rounded bg-[#111116] border-2 border-[#2E29FF] font-label text-xs uppercase tracking-[0.06em] text-white focus:outline-none focus:border-[#CCFF00] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="protein-desc">Highest Protein</option>
              <option value="calories-asc">Lowest Calories</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#16161D] border-2 border-[#FF007F] rounded-xl p-10 text-center space-y-4 neo-shadow-dark">
          <p className="font-display font-bold text-2xl text-white">
            No drops match "{query}"
          </p>
          <p className="font-body text-sm text-[#c4c9ac]">
            Try clearing your search or switching back to all product categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="neo-btn neo-btn-turbo px-5 py-2.5 rounded font-label text-xs uppercase tracking-[0.06em] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
