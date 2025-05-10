# MetaMask DevOps Snap CLI Suite

A MetaMask Snap that integrates DevOps tooling directly into the wallet interface for smart contract management and deployment. This innovative tool bridges the gap between wallet functionality and developer tools, empowering developers to manage the full dapp lifecycle from within their MetaMask wallet.

## Features

### Core Functionality
- **Embedded CLI Terminal**: Access common DevOps commands (build, test, deploy, lint) through a secure terminal inside MetaMask
- **Project Management**: Easily switch between multiple blockchain projects
- **Transaction Handling**: Sign and broadcast deployment transactions directly from the interface
- **Command History**: Track previous operations with detailed output logs

### DeFi Integration
- **Protocol Monitoring**: Real-time metrics on DeFi protocol performance
- **Live Notifications**: WebSocket-powered alerts for important protocol events
- **Cross-Chain Support**: Monitor transactions across multiple blockchains
- **Security Analysis**: View security metrics and vulnerability reports for smart contracts

### Technical Foundation
- **React Frontend**: Modern, responsive UI built with React and TailwindCSS
- **Express Backend**: Fast, reliable API server
- **PostgreSQL Database**: Persistent storage with Drizzle ORM
- **WebSocket Support**: Real-time updates and notifications

## Screenshots

[Include screenshots of your application here]

## Installation

### Prerequisites
- Node.js (v20.x recommended)
- PostgreSQL database

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/metamask-devops-snap.git
   cd metamask-devops-snap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your database connection string:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/yourdbname
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5000`

## Usage

### Terminal Commands
- `mm-snap build`: Build your project
- `mm-snap test`: Run your test suite
- `mm-snap deploy --network <network>`: Deploy contracts to specified network
- `mm-snap verify --network <network>`: Verify contract source code on block explorer
- `mm-snap monitor --defi`: Monitor DeFi protocol for events and transactions
- `mm-snap analyze --security`: Perform risk analysis on smart contracts
- `mm-snap cross-chain --setup`: Configure cross-chain transaction monitoring

### DeFi Dashboard
Navigate to the DeFi tab to access:
- Protocol metrics with TVL and volume statistics
- Live notifications for important events
- Cross-chain monitoring across multiple networks
- Security analysis for your smart contracts

## Architecture

The application follows a clean architecture pattern:

```
├── client/               # Frontend React application
│   ├── src/
│       ├── components/   # UI components including DeFi dashboards
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utility functions
│       ├── pages/        # Application pages
│
├── server/               # Backend Express server
│   ├── db.ts             # Database connection setup
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database storage implementation
│   ├── vite.ts           # Vite integration
│
├── shared/               # Shared code between client and server
│   ├── schema.ts         # Database schema definitions
```

## Future Enhancements
- Authentication system for multi-user support
- Integration with actual blockchain networks for live data
- Enhanced smart contract analysis and testing tools
- Mobile-responsive design improvements
- Expanded cross-chain support

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- MetaMask Snaps for providing the framework to extend wallet functionality
- The Ethereum developer community for inspiration