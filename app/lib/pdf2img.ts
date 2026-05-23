/**
 * Represents the result of a PDF conversion process.
 */
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

/**
 * Lazily loads the PDF.js library and configures the worker.
 * Uses a promise to prevent redundant loading.
 */
async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    loadPromise = Promise.all([
        // @ts-expect-error - External library import
        import("pdfjs-dist/build/pdf.mjs"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),   
    ]).then(([lib, worker]) => {
        lib.GlobalWorkerOptions.workerSrc = worker.default;
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

/**
 * Converts the first page of a PDF file into a high-quality PNG image.
 */
export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        
        // Initialize PDF document and extract the first page
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        // Set scale for high resolution (4x)
        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        await page.render({ canvasContext: context!, viewport }).promise;

        // Convert canvas to File object
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return resolve({ imageUrl: "", file: null, error: "Blob creation failed" });
                }

                const fileName = file.name.replace(/\.pdf$/i, ".png");
                const imageFile = new File([blob], fileName, { type: "image/png" });

                resolve({
                    imageUrl: URL.createObjectURL(blob),
                    file: imageFile,
                });
            }, "image/png", 1.0);
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: err instanceof Error ? err.message : "PDF conversion failed",
        };
    }
}
