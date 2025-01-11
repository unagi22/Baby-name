import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Baby, Heart, Star, Share2, Filter } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import type { Gender } from '../types';

export default function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentProject,
    nameSuggestions,
    loading,
    error,
    loadProject,
    addNameSuggestion,
    toggleFavorite,
    toggleLike
  } = useProjectStore();

  const [showAddName, setShowAddName] = useState(false);
  const [newName, setNewName] = useState('');
  const [suggestedBy, setSuggestedBy] = useState(() => {
    return localStorage.getItem('lastContributor') || '';
  });
  const [selectedGender, setSelectedGender] = useState<Gender>('boy');
  const [showFilters, setShowFilters] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [contributorFilter, setContributorFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject(id).catch((error) => {
        if (error.message === 'Project not found') {
          navigate('/not-found', { 
            replace: true,
            state: { message: 'The project you are looking for does not exist or has been removed.' }
          });
        }
      });
    }
  }, [id, loadProject, navigate]);

  const handleShare = async () => {
    if (!currentProject) return;
    
    const url = window.location.href;
    const title = 'Baby Name Project';
    const text = `Help ${currentProject.parents_names} choose a ${currentProject.gender_preference === 'either' ? '' : currentProject.gender_preference + ' '}baby name! Click to suggest names and vote.`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
          alert('Project link copied to clipboard!');
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Project link copied to clipboard!');
    }
  };

  const handleAddName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !suggestedBy.trim()) return;

    try {
      await addNameSuggestion(newName, selectedGender, suggestedBy);
      localStorage.setItem('lastContributor', suggestedBy);
      setNewName('');
      setSuggestedBy('');
      setShowAddName(false);
    } catch (error) {
      console.error('Failed to add name:', error);
      alert('Failed to add name. Please try again.');
    }
  };

  const getBabyIcon = (gender: Gender, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    const baseClass = `${sizeClass} transition-colors`;
    
    switch (gender) {
      case 'boy':
        return (
          <div className={`${baseClass} text-blue-500`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8z" fill="currentColor"/>
              <path d="M15 14H9a5 5 0 00-5 5v1a2 2 0 002 2h12a2 2 0 002-2v-1a5 5 0 00-5-5z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'girl':
        return (
          <div className={`${baseClass} text-pink-500`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8z" fill="currentColor"/>
              <path d="M12 14c-3.314 0-6 2.686-6 6v1a2 2 0 002 2h8a2 2 0 002-2v-1c0-3.314-2.686-6-6-6z" fill="currentColor"/>
              <circle cx="12" cy="7" r="2" fill="white"/>
            </svg>
          </div>
        );
      default: // either
        return (
          <div className={`${baseClass} text-purple-500`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 8a6 6 0 1112 0A6 6 0 016 8z" fill="currentColor"/>
              <path d="M12 14c-3.314 0-6 2.686-6 6v1a2 2 0 002 2h8a2 2 0 002-2v-1c0-3.314-2.686-6-6-6z" fill="currentColor"/>
              <path d="M9 7h6M12 4v6" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
        );
    }
  };

  const filteredNames = nameSuggestions
    .filter(name => {
      if (genderFilter !== 'all' && name.gender !== genderFilter) return false;
      if (showFavoritesOnly && !name.is_favorite) return false;
      if (contributorFilter !== 'all' && name.suggested_by !== contributorFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const uniqueContributors = Array.from(new Set(nameSuggestions.map(s => s.suggested_by)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error && error !== 'Project not found') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {currentProject ? (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{currentProject.parents_names}'s Project</h1>
                <p className="text-gray-500">Looking for baby names</p>
              </div>
              <div className="ml-auto flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {showFilters && (
              <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-lg z-40 overflow-y-auto">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Gender</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="all"
                            checked={genderFilter === 'all'}
                            onChange={(e) => setGenderFilter(e.target.value as typeof genderFilter)}
                            className="mr-2"
                          />
                          All Genders
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="boy"
                            checked={genderFilter === 'boy'}
                            onChange={(e) => setGenderFilter(e.target.value as typeof genderFilter)}
                            className="mr-2"
                          />
                          Male Names
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="girl"
                            checked={genderFilter === 'girl'}
                            onChange={(e) => setGenderFilter(e.target.value as typeof genderFilter)}
                            className="mr-2"
                          />
                          Female Names
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Sort By</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="sort"
                            value="newest"
                            checked={sortBy === 'newest'}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="mr-2"
                          />
                          Newest First
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="sort"
                            value="popular"
                            checked={sortBy === 'popular'}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="mr-2"
                          />
                          Most Popular
                        </label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">By Contributor</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="contributor"
                            value="all"
                            checked={contributorFilter === 'all'}
                            onChange={(e) => setContributorFilter(e.target.value)}
                            className="mr-2"
                          />
                          All Contributors
                        </label>
                        {uniqueContributors.map(contributor => (
                          <label key={contributor} className="flex items-center">
                            <input
                              type="radio"
                              name="contributor"
                              value={contributor}
                              checked={contributorFilter === contributor}
                              onChange={(e) => setContributorFilter(e.target.value)}
                              className="mr-2"
                            />
                            {contributor}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === 'all'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    All Names
                  </button>
                  <button
                    onClick={() => setActiveTab('favorites')}
                    className={`ml-8 py-2 px-4 text-sm font-medium ${
                      activeTab === 'favorites'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Favorites
                  </button>
                </nav>
              </div>
            </div>

            {activeTab === 'all' ? (
              filteredNames.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No names yet</p>
                  <button
                    onClick={() => setShowAddName(true)}
                    className="mt-4 px-6 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    Add First Name
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNames.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-medium">{suggestion.name}</span>
                        {getBabyIcon(suggestion.gender)}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Suggested by {suggestion.suggested_by}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleLike(suggestion.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                            title={suggestion.likes > 0 ? 'Unlike' : 'Like'}
                          >
                            <Heart className={`w-4 h-4 ${suggestion.likes > 0 ? 'fill-current text-red-500' : ''}`} />
                            <span>{suggestion.likes}</span>
                          </button>
                          <button
                            onClick={() => toggleFavorite(suggestion.id)}
                            className={`${
                              suggestion.is_favorite
                                ? 'text-yellow-500'
                                : 'text-gray-400 hover:text-yellow-500'
                            } transition-colors`}
                            title={suggestion.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Star className={`w-4 h-4 ${suggestion.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div>
                {filteredNames.filter(n => n.is_favorite).length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No favorite names yet</p>
                    <p className="text-sm text-gray-400 mt-2">Star names to add them to your favorites</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredNames
                      .filter(n => n.is_favorite)
                      .map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-yellow-200 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-medium">{suggestion.name}</span>
                            {getBabyIcon(suggestion.gender)}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Suggested by {suggestion.suggested_by}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleLike(suggestion.id)}
                                className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                                title={suggestion.likes > 0 ? 'Unlike' : 'Like'}
                              >
                                <Heart className={`w-4 h-4 ${suggestion.likes > 0 ? 'fill-current text-red-500' : ''}`} />
                                <span>{suggestion.likes}</span>
                              </button>
                              <button
                                onClick={() => toggleFavorite(suggestion.id)}
                                className="text-yellow-500"
                                title="Remove from favorites"
                              >
                                <Star className="w-4 h-4 fill-current" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {showAddName && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Suggest a Name</h2>
                  <button
                    onClick={() => setShowAddName(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleAddName} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Baby Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter a baby name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['boy', 'girl'] as const).map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setSelectedGender(gender)}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                            selectedGender === gender
                              ? gender === 'boy'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          {getBabyIcon(gender)}
                          <span className={`mt-2 text-center capitalize ${
                            selectedGender === gender
                              ? gender === 'boy'
                                ? 'text-blue-700'
                                : 'text-pink-700'
                              : 'text-gray-600'
                          }`}>
                            {gender}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={suggestedBy}
                      onChange={(e) => setSuggestedBy(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Submit Suggestion
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}