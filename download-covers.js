// Clauded generated script. Only works for popular recent books

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the images directory if it doesn't exist
const imagesDir = path.join("src", "assets", "images", "books");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Define books with titles, authors, and filenames
const books = [
  {
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    filename: "brothers-karamazov.jpg",
    isbn: "9780374528379",
  },
  {
    title: "East of Eden",
    author: "John Steinbeck",
    filename: "east-of-eden.jpg",
    isbn: "9780140186390",
  },
  {
    title: "The Fifth Season",
    author: "N.K. Jemisin",
    filename: "fifth-season.jpg",
    isbn: "9780316229296",
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    filename: "jane-eyre.jpg",
    isbn: "9780141441146",
  },
  {
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    filename: "anna-karenina.jpg",
    isbn: "9780143035008",
  },
  {
    title: "Giovanni's Room",
    author: "James Baldwin",
    filename: "giovannis-room.jpg",
    isbn: "9780345806567",
  },
  {
    title: "My Brilliant Friend",
    author: "Elena Ferrante",
    filename: "my-brilliant-friend.jpg",
    isbn: "9781609450786",
  },
  {
    title: "The Remains of the Day",
    author: "Kazuo Ishiguro",
    filename: "remains-of-the-day.jpg",
    isbn: "9780679731726",
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    filename: "left-hand-of-darkness.jpg",
    isbn: "9780441478125",
  },
];

// HTTP/HTTPS request with promise and redirect handling
function fetchWithRedirect(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : require("http");

    protocol
      .get(url, options, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          if (response.headers.location) {
            console.log(
              `Following redirect: ${url} -> ${response.headers.location}`
            );
            return fetchWithRedirect(response.headers.location, options)
              .then(resolve)
              .catch(reject);
          }
        }

        // Collect response data
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const data = Buffer.concat(chunks);
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            data,
          });
        });
      })
      .on("error", reject);
  });
}

// JSON fetch helper
function fetchJSON(url) {
  return fetchWithRedirect(url).then((response) => {
    if (response.statusCode !== 200) {
      throw new Error(`HTTP error ${response.statusCode}`);
    }
    return JSON.parse(response.data.toString());
  });
}

// Download image helper
function downloadImage(url, filepath) {
  return fetchWithRedirect(url).then((response) => {
    if (response.statusCode !== 200) {
      throw new Error(
        `Failed to download image, status code: ${response.statusCode}`
      );
    }

    // Check if it's actually an image
    const contentType = response.headers["content-type"] || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Not an image: ${contentType}`);
    }

    // Save the image
    fs.writeFileSync(filepath, response.data);
    console.log(`Downloaded: ${filepath}`);
    return true;
  });
}

// Search using Google Books API
async function searchGoogleBooks(title, author) {
  const query = encodeURIComponent(`${title} ${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  try {
    const data = await fetchJSON(url);

    if (data.items && data.items.length > 0) {
      const book = data.items[0];
      const imageLinks = book.volumeInfo.imageLinks;

      if (imageLinks) {
        // Use the largest available image
        const imageUrl =
          imageLinks.large ||
          imageLinks.medium ||
          imageLinks.small ||
          imageLinks.thumbnail;
        // Replace http with https and remove zoom parameters for higher quality
        return imageUrl.replace("http://", "https://").replace("&zoom=1", "");
      }
    }
    return null;
  } catch (error) {
    console.error(
      `Error searching Google Books for "${title}":`,
      error.message
    );
    return null;
  }
}

// Search using OpenLibrary with ISBN
async function searchOpenLibraryByISBN(isbn) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;

  try {
    const data = await fetchJSON(url);
    const book = data[`ISBN:${isbn}`];

    if (book && book.cover) {
      return book.cover.large || book.cover.medium || book.cover.small;
    }
    return null;
  } catch (error) {
    console.error(
      `Error searching OpenLibrary for ISBN ${isbn}:`,
      error.message
    );
    return null;
  }
}

// Amazon book cover URL (as a fallback)
function getAmazonCoverURL(isbn) {
  return `https://images-na.ssl-images-amazon.com/images/P/${isbn}.01.LZZZZZZZ.jpg`;
}

// Download covers with multiple sources and fallbacks
async function downloadBookCover(book) {
  const filepath = path.join(imagesDir, book.filename);
  const sources = [
    // Try Google Books first (most reliable and good quality)
    async () => {
      console.log(`Trying Google Books for "${book.title}"...`);
      const url = await searchGoogleBooks(book.title, book.author);
      if (url) return downloadImage(url, filepath);
      return false;
    },

    // Try OpenLibrary with ISBN
    async () => {
      if (!book.isbn) return false;
      console.log(`Trying OpenLibrary with ISBN for "${book.title}"...`);
      const url = await searchOpenLibraryByISBN(book.isbn);
      if (url) return downloadImage(url, filepath);
      return false;
    },

    // Try OpenLibrary with title/author as fallback
    async () => {
      console.log(`Trying OpenLibrary Title/Author for "${book.title}"...`);
      const query = encodeURIComponent(`${book.title} ${book.author}`);
      const url = `https://covers.openlibrary.org/b/title/${query}-L.jpg`;
      try {
        return downloadImage(url, filepath);
      } catch (e) {
        return false;
      }
    },

    // Try Amazon as last resort
    async () => {
      if (!book.isbn) return false;
      console.log(`Trying Amazon for "${book.title}"...`);
      const url = getAmazonCoverURL(book.isbn);
      try {
        return downloadImage(url, filepath);
      } catch (e) {
        return false;
      }
    },
  ];

  // Try each source in sequence until one succeeds
  for (const source of sources) {
    try {
      const success = await source();
      if (success) {
        console.log(`Successfully downloaded cover for "${book.title}"`);
        return true;
      }
    } catch (error) {
      console.log(`Source failed: ${error.message}`);
    }
  }

  // All sources failed
  console.error(`Failed to download cover for "${book.title}" from any source`);
  return false;
}

// Download a default placeholder
async function downloadPlaceholder() {
  const filepath = path.join(imagesDir, "book-placeholder.jpg");
  const placeholderUrl =
    "https://via.placeholder.com/400x600/e0e0e0/969696.png?text=No+Cover+Available";

  try {
    await downloadImage(placeholderUrl, filepath);
    console.log("Downloaded placeholder image");
    return true;
  } catch (error) {
    console.error("Failed to download placeholder:", error.message);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Make sure we have a placeholder
    await downloadPlaceholder();

    // Process each book with delay between requests
    for (const book of books) {
      console.log(`\nProcessing "${book.title}" by ${book.author}`);
      await downloadBookCover(book);

      // Delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    console.log("\nAll book covers processed!");
  } catch (error) {
    console.error("Error in main process:", error);
  }
}

// Run the script
main();
