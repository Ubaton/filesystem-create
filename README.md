# File Structure Generator

This project is a File Structure Generator built with Next.js and React. It allows users to create and visualize file structures, and generate downloadable ZIP files based on the input.

![File Structure Generator]()

## Features

- Interactive file structure input
- Visual representation of the file structure
- Customizable default file type
- ZIP file generation for download
- Dark/Light mode toggle

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Enter your desired file structure in the text area, using spaces for indentation.
2. Select the default file type for files without extensions.
3. Click "Generate Structure" to visualize the file structure.
4. Optionally, click "Download ZIP" to get a ZIP file of the structure.

## Components

- `FileStructureGenerator`: The main component that handles the file structure generation and visualization.
- `Navigation`: Provides the navigation bar with theme toggle and external links.

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Shadcn UI
- Lucide React (for icons)
- JSZip (for ZIP file generation)
- File-saver (for downloading files)
- Framer Motion (for animations)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
