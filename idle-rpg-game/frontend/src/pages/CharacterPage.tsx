import React from 'react';
import { useParams } from 'react-router-dom';

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Character Management</h1>
      <p>Character ID: {id}</p>
      <p>This is where character progression and skill trees will be implemented.</p>
    </div>
  );
};

export default CharacterPage;