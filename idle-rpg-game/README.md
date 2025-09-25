# Idle RPG Game

A web-based idle RPG featuring Diablo II-style loot systems with random affixes, rarity tiers, item sets, and deep progression mechanics. Players engage in automated combat while managing inventory, crafting, and character builds.

## 🎮 Features

### Current Implementation (Phase 1 - Foundation)
- **User Authentication**: Secure registration and login system with JWT tokens
- **Character Management**: Create and manage multiple characters with different classes
- **Character Classes**: Warrior, Mage, Rogue, Paladin, and Necromancer with unique base stats
- **Responsive UI**: Modern, mobile-friendly interface with React and TypeScript
- **RESTful API**: Comprehensive backend API with Express.js and TypeScript

### Planned Features
- **Idle Combat System**: Automated battle progression with speed controls
- **Diablo II-Style Loot**: Random affixes, rarity tiers, item sets, and unique items
- **Character Progression**: Leveling, skill trees, and prestige mechanics
- **Inventory Management**: Grid-based inventory with item comparison
- **Crafting System**: Item enhancement and material-based crafting
- **Endgame Content**: Infinite dungeons, boss encounters, and challenges

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd idle-rpg-game
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:3001

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on http://localhost:3000

5. **Access the application**
   - Open http://localhost:3000 in your browser
   - Register a new account or login
   - Create your first character and start playing!

## 🏗️ Project Structure

```
idle-rpg-game/
├── backend/                 # Node.js/Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Authentication, validation
│   │   ├── routes/          # API route definitions
│   │   ├── types/           # TypeScript type definitions
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── App.tsx          # Main application component
│   ├── package.json
│   └── public/
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Characters
- `GET /api/characters` - List user characters
- `POST /api/characters` - Create new character
- `GET /api/characters/:id` - Get character details
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

### Game
- `GET /api/game/:characterId/state` - Get game state
- `POST /api/game/:characterId/action` - Perform game action

### Health
- `GET /health` - Server health check

## 🎯 Character Classes

### Warrior
- **Role**: Tank
- **Base Stats**: High Strength (15), High Vitality (12)
- **Playstyle**: Melee combat, high health, physical damage

### Mage
- **Role**: Ranged DPS
- **Base Stats**: High Intelligence (15), High Vitality (12)
- **Playstyle**: Magical damage, mana management, area effects

### Rogue
- **Role**: DPS/Stealth
- **Base Stats**: High Dexterity (15), Balanced stats
- **Playstyle**: Critical hits, speed, stealth abilities

### Paladin
- **Role**: Support/Tank
- **Base Stats**: Balanced across all stats
- **Playstyle**: Healing abilities, defensive buffs, versatile

### Necromancer
- **Role**: Summoner/DPS
- **Base Stats**: High Intelligence (15), High Dexterity (12)
- **Playstyle**: Minion summoning, dark magic, unique mechanics

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
```

### Frontend Development
```bash
cd frontend
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

### Code Quality
- **TypeScript**: Full type safety across frontend and backend
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Rate Limiting**: API rate limiting protection
- **CORS Configuration**: Cross-origin request security
- **Helmet.js**: Security headers

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Dark/Light Theme**: Theme system (planned)
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time form validation
- **Accessibility**: Keyboard navigation and screen reader support

## 🚧 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and infrastructure
- [x] User authentication system
- [x] Character management
- [x] Basic UI framework

### Phase 2: Core Gameplay (In Progress)
- [ ] Idle combat system
- [ ] Character progression and leveling
- [ ] Basic loot system
- [ ] Inventory management

### Phase 3: Advanced Features
- [ ] Diablo II-style loot with affixes
- [ ] Item sets and unique items
- [ ] Crafting and enhancement
- [ ] Skill trees and abilities

### Phase 4: Endgame Content
- [ ] Prestige/rebirth mechanics
- [ ] Infinite dungeons
- [ ] Boss encounters
- [ ] Achievement system

### Phase 5: Polish & Launch
- [ ] Performance optimization
- [ ] Mobile app
- [ ] Analytics and monitoring
- [ ] Community features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Diablo II's legendary loot system
- Built with modern web technologies
- Designed for both casual and hardcore players

---

**Status**: 🚧 In Active Development  
**Version**: 1.0.0-alpha  
**Last Updated**: September 2024