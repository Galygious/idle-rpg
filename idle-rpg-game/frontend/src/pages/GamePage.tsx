import React from 'react';
import { useParams } from 'react-router-dom';

const GamePage: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Game Page</h1>
      <p>Character ID: {characterId}</p>
      <p>This is where the idle combat system will be implemented.</p>
    </div>
  );
};

export default GamePage;