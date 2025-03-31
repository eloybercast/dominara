# Dominara

A game by Eloy Bermejo
Licensed under GPLv3 - See LICENSE for details.
Official repository: github.com/dominara-team/dominara
Contributions welcome!

## Development

### Prerequisites

- Node.js (v22 or later)
- Rust (latest stable)
- Tauri CLI
- System dependencies for Tauri development

### Setup

1. Install project dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run tauri dev
```

### Building

To create a production build:

```bash
npm run tauri build
```

The built application will be available in `src-tauri/target/release`.

### Project Structure

- `/src` - Frontend source code
- `/src-tauri` - Rust backend code
- `/public` - Static assets

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
