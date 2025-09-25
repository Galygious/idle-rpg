import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Character } from '../services/api';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    class: 'warrior',
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getCharacters();
      if (response.success && response.data) {
        setCharacters(response.data);
      } else {
        setError('Failed to load characters');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load characters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacter.name.trim()) return;

    try {
      const response = await apiService.createCharacter(newCharacter);
      if (response.success && response.data) {
        setCharacters(prev => [...prev, response.data!]);
        setNewCharacter({ name: '', class: 'warrior' });
        setShowCreateForm(false);
      } else {
        setError('Failed to create character');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create character');
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this character?')) {
      return;
    }

    try {
      const response = await apiService.deleteCharacter(id);
      if (response.success) {
        setCharacters(prev => prev.filter(char => char.id !== id));
      } else {
        setError('Failed to delete character');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete character');
    }
  };

  const characterClasses = [
    { value: 'warrior', label: 'Warrior', description: 'High health, physical damage, tank role' },
    { value: 'mage', label: 'Mage', description: 'High mana, magical damage, ranged role' },
    { value: 'rogue', label: 'Rogue', description: 'High speed, critical hits, stealth role' },
    { value: 'paladin', label: 'Paladin', description: 'Balanced stats, healing abilities, support role' },
    { value: 'necromancer', label: 'Necromancer', description: 'Minion summoning, dark magic, unique mechanics' },
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading your characters..." />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Idle RPG Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        <div className="characters-section">
          <div className="section-header">
            <h2>Your Characters</h2>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-character-button"
              disabled={characters.length >= 5}
            >
              Create Character ({characters.length}/5)
            </button>
          </div>

          {showCreateForm && (
            <div className="create-character-form">
              <h3>Create New Character</h3>
              <form onSubmit={handleCreateCharacter}>
                <div className="form-group">
                  <label htmlFor="characterName">Character Name</label>
                  <input
                    type="text"
                    id="characterName"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter character name"
                    maxLength={20}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="characterClass">Class</label>
                  <select
                    id="characterClass"
                    value={newCharacter.class}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, class: e.target.value }))}
                  >
                    {characterClasses.map(cls => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                  <p className="class-description">
                    {characterClasses.find(cls => cls.value === newCharacter.class)?.description}
                  </p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Create Character
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="characters-grid">
            {characters.length === 0 ? (
              <div className="no-characters">
                <p>You don't have any characters yet.</p>
                <p>Create your first character to start your adventure!</p>
              </div>
            ) : (
              characters.map(character => (
                <div key={character.id} className="character-card">
                  <div className="character-info">
                    <h3>{character.name}</h3>
                    <p className="character-class">
                      {characterClasses.find(cls => cls.value === character.class)?.label}
                    </p>
                    <p className="character-level">Level {character.level}</p>
                    <div className="character-stats">
                      <div className="stat">
                        <span className="stat-label">STR:</span>
                        <span className="stat-value">{character.stats.strength}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">DEX:</span>
                        <span className="stat-value">{character.stats.dexterity}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">INT:</span>
                        <span className="stat-value">{character.stats.intelligence}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">VIT:</span>
                        <span className="stat-value">{character.stats.vitality}</span>
                      </div>
                    </div>
                  </div>
                  <div className="character-actions">
                    <Link 
                      to={`/game/${character.id}`}
                      className="play-button"
                    >
                      Play
                    </Link>
                    <Link 
                      to={`/character/${character.id}`}
                      className="manage-button"
                    >
                      Manage
                    </Link>
                    <button 
                      onClick={() => handleDeleteCharacter(character.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;