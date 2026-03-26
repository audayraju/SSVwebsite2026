Place your hero image file here so the site can reference it at /picture/custom-hero.jpeg

Steps:
1. Save the image file you attached as: custom-hero.jpeg
2. Put it in this folder: e:\ssv folder\SSVwebsite2026\picture\
   (The app serves files from the project root, so the image will be available at /picture/custom-hero.jpeg)
3. Restart the dev server (if running) or rebuild the app:

# from the ssv-react directory
npm run dev

4. Visit the homepage to confirm the new image appears in the left-hand hero section.

Notes:
- If your image is in PNG/WebP/JPEG with a different extension, update the path in src/pages/Home.jsx accordingly.
- If you prefer the image inside the React app public folder, move the file to ssv-react/public/picture/ and use the same path (/picture/custom-hero.jpeg).