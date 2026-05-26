'use client';

import React from 'react';
import { trpc } from '@/lib/trpc';
import { useEditorStore } from '@/store/editorStore';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const difficultyOptions = [
  { value: 'all', label: 'All levels' },
  { value: '1', label: 'Beginner' },
  { value: '2', label: 'Intermediate' },
  { value: '3', label: 'Advanced' },
];

export default function SnippetList() {
  const { languageId, setCode } = useEditorStore();
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: facets } = trpc.getSnippetFacets.useQuery({
    languageSlug: languageId,
  });

  React.useEffect(() => {
    if (category !== 'all' && !facets?.categories.includes(category)) {
      setCategory('all');
    }

    if (!facets) return;

    setSelectedTags((current) => current.filter((tag) => facets.tags.includes(tag)));
  }, [category, facets]);

  const { data: snippets, isLoading } = trpc.getSnippets.useQuery({
    languageSlug: languageId,
    difficulty: difficulty === 'all' ? undefined : Number(difficulty),
    category: category === 'all' ? undefined : category,
    search: debouncedSearch || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  const activeFilterCount =
    (difficulty !== 'all' ? 1 : 0) +
    (category !== 'all' ? 1 : 0) +
    selectedTags.length +
    (debouncedSearch ? 1 : 0);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDifficulty('all');
    setCategory('all');
    setSelectedTags([]);
  };

  return (
    <div className="w-80 border-r border-border-dim bg-bg-surface flex flex-col">
      <div className="p-4 border-b border-border-dim space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-text-lo uppercase tracking-widest">Snippets</h2>
            <span className="text-[10px] text-text-lo">
              {snippets?.length ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-lo">
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded border border-border-dim px-2 py-1 text-[10px] hover:text-text-hi hover:border-accent/40 transition-colors"
              >
                <X size={10} />
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-lo" />
          <input
            type="text"
            placeholder="Search title, tags, category, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-base border border-border-dim rounded-md pl-9 pr-3 py-1.5 text-xs text-text-hi focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-bg-base border border-border-dim rounded-md px-2 py-1.5 text-xs text-text-hi focus:outline-none focus:border-accent transition-colors"
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-bg-base border border-border-dim rounded-md px-2 py-1.5 text-xs text-text-hi focus:outline-none focus:border-accent transition-colors"
          >
            <option value="all">All categories</option>
            {facets?.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {facets?.tags.length ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-lo uppercase tracking-widest">Tags</span>
              {selectedTags.length > 0 && (
                <span className="text-[10px] text-text-lo">{selectedTags.length} selected</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {facets.tags.slice(0, 18).map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-2 py-1 text-[10px] transition-colors ${
                      isActive
                        ? 'border-accent bg-accent text-bg-base'
                        : 'border-border-dim text-text-lo hover:border-accent/40 hover:text-text-hi'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-bg-raised animate-pulse rounded border border-border-dim" />
          ))
        ) : snippets?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-text-lo">No snippets found.</p>
          </div>
        ) : (
          snippets?.map((snippet) => (
            <div
              key={snippet.id}
              onClick={() => setCode(snippet.code)}
              className="p-3 rounded bg-bg-raised border border-border-dim hover:border-accent/40 cursor-pointer group transition-all"
            >
              <h3 className="text-sm font-bold text-text-hi group-hover:text-accent transition-colors truncate">
                {snippet.title}
              </h3>
              <p className="text-xs text-text-lo mt-1 line-clamp-2 leading-relaxed">
                {snippet.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  snippet.difficulty === 1 ? 'border-success/30 text-success bg-success/5' :
                  snippet.difficulty === 2 ? 'border-warning/30 text-warning bg-warning/5' :
                  'border-error/30 text-error bg-error/5'
                }`}>
                  {snippet.difficulty === 1 ? 'Beginner' : snippet.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                </span>
                <span className="text-[10px] text-text-lo">{snippet.views} views</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {snippet.category && (
                  <span className="rounded-full border border-border-dim px-2 py-1 text-[10px] text-text-lo">
                    {snippet.category}
                  </span>
                )}
                {snippet.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-border-dim px-2 py-1 text-[10px] text-text-lo"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
