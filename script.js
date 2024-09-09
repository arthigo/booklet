document.addEventListener('DOMContentLoaded', () => {
    const books = document.querySelectorAll('.book');
    const pdfViewer = document.getElementById('pdf-viewer');
    const epubViewer = document.getElementById('epub-viewer');
    const epubContainer = document.getElementById('epub-container');
    const pdfIframe = document.getElementById('pdf-iframe');
    const closePdf = document.getElementById('close-pdf');
    const closeEpub = document.getElementById('close-epub');
    let bookRendition = null;

    // Automatically set book titles based on file name
    books.forEach(book => {
        const fileUrl = book.getAttribute('data-file');
        const titleElement = book.querySelector('.book-title');
        const formattedTitle = formatTitle(fileUrl);
        titleElement.textContent = formattedTitle; // Set the title
    });

    // Handle book click event to open PDF or EPUB
    books.forEach(book => {
        book.addEventListener('click', () => {
            const fileUrl = book.getAttribute('data-file');
            if (fileUrl.endsWith('.pdf')) {
                openPDF(fileUrl);
            } else if (fileUrl.endsWith('.epub')) {
                openEPUB(fileUrl);
            }
        });
    });

    // Open PDF file in iframe
    function openPDF(fileUrl) {
        pdfIframe.src = fileUrl;  // Open the PDF
        pdfViewer.style.display = 'flex';
        epubViewer.style.display = 'none';
    }

    // Open EPUB file using ePub.js
    function openEPUB(fileUrl) {
        if (bookRendition) {
            bookRendition.destroy(); // Destroy the previous EPUB instance
        }

        epubViewer.style.display = 'block';
        pdfViewer.style.display = 'none';

        const book = ePub(fileUrl);  // Load EPUB file
        bookRendition = book.renderTo(epubContainer, {
            width: "100%",
            height: "100%"
        });
        bookRendition.display();

        // Save and restore reading position using localStorage
        const key = `epub-${fileUrl}`;
        const savedLocation = localStorage.getItem(key);
        if (savedLocation) {
            bookRendition.display(savedLocation);  // Open at saved location
        }
        bookRendition.on('relocated', (location) => {
            localStorage.setItem(key, location.start.cfi);  // Save current location
        });
    }

    // Close PDF viewer
    closePdf.addEventListener('click', () => {
        pdfViewer.style.display = 'none';
        pdfIframe.src = '';  // Clear PDF source
    });

    // Close EPUB viewer
    closeEpub.addEventListener('click', () => {
        epubViewer.style.display = 'none';
        epubContainer.innerHTML = '';  // Clear EPUB content
    });

    // Function to format the file name into a readable title
    function formatTitle(fileUrl) {
        const fileName = fileUrl.split('/').pop().replace(/\.(pdf|epub)/, '');
        return fileName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }
});
