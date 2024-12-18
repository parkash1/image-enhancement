import React, { useState, useEffect, useRef } from "react";
import "./ImageEnhancement.css";

const ImageEnhancement = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [filter, setFilter] = useState("");
    const [filterDescription, setFilterDescription] = useState("");
    const canvasRef = useRef(null);

    const [cvLoaded, setCvLoaded] = useState(false);

    useEffect(() => {
        const waitForCv = () => {
            if (window.cv && window.cv.getBuildInformation) {
                console.log("OpenCV.js loaded!");
                setCvLoaded(true);
            } else {
                setTimeout(waitForCv, 50);
            }
        };
        waitForCv();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
        }
    };

    const applyFilter = () => {
        if (!uploadedImage || !filter || !cvLoaded) return;

        const imgElement = document.createElement("img");
        imgElement.src = uploadedImage;
        imgElement.onload = () => {
            const src = cv.imread(imgElement);
            const dst = new cv.Mat();
            let description = "";

            switch (filter) {
                case "gamma":
                    cv.convertScaleAbs(src, dst, 1, 50); // Gamma correction
                    description = `
                        Gamma Correction
                        Gamma correction adjusts image brightness by changing pixel intensity non-linearly. It enhances dark or bright areas, improving visibility. In your image, gamma correction brightened dark regions, balancing contrast for better details, especially in textured or shadowed parts..
                    `;
                    break;
                case "laplacian":
                    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
                    cv.Laplacian(src, dst, cv.CV_8U); // Laplacian filter
                    description = `
                        Laplacian Filter
                          it highlights regions of rapid intensity change in an image, detecting edges.
                          It is primarily used for edge detection in images.
                          The Laplacian filter is unique in that it enhances edges, making it easier to identify sharp changes in an image.
                          It highlights the edges in the image, which can help detect boundaries or contours of objects.
                          When you need to extract features or detect edges in an image, often used in object recognition and image segmentation tasks.
                    `;
                    break;
                case "gaussian":
                    cv.GaussianBlur(src, dst, new cv.Size(5, 5), 0); // Gaussian blur
                    description = `
                        Gaussian Blur:
                           its a smoothing filter that reduces noise and detail by applying a Gaussian function to the image.
                           It is primarily used for blurring images to reduce noise or details.
                           Unlike other filters that enhance sharpness or edges, Gaussian blur softens the image, making it less sharp.
                           It will soften the image, reduce noise, and smooth out areas with a high level of detail.
                           Commonly used to reduce noise in images before performing other processing tasks, such as edge detection or feature extraction.
                    `;
                    break;
                case "histogram-equalization":
                    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY); // Convert to grayscale
                    cv.equalizeHist(src, dst); // Apply histogram equalization
                    description = `
                        Histogram Equalization:
                          enhances the contrast of an image by adjusting the intensity distribution of pixels.
                          To improve image contrast, especially in images with low contrast due to poor lighting conditions.
                          Unlike other filters that focus on edges or blurring, this filter specifically enhances the image's contrast by spreading pixel intensity values.
                          The image will have better contrast, bringing out more details in both bright and dark areas.
                          Often used in medical imaging, low-light photographs, or when a clearer image is needed to highlight features or details.
                    `;
                    break;
                case "edge-detection":
                    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
                    cv.Canny(src, dst, 100, 200); // Canny edge detection
                    description = `
                        Canny Edge:
                          it detects edges by identifying areas with rapid intensity changes in an image.
                          It is used to identify the boundaries of objects within an image.
                          The Canny edge detector is particularly designed to minimize the number of edges detected while preserving sharp boundaries.
                          It will produce a black-and-white image highlighting the edges of objects, with less noise compared to the Laplacian filter.
                          Typically used in applications that require precise edge localization, such as in object tracking, image segmentation, and feature extraction.
                    `;
                    break;
                default:
                    return;
            }

            setFilterDescription(description);
            cv.imshow(canvasRef.current, dst);
            src.delete();
            dst.delete();
        };
    };

    return (
        <div className="image-enhancement-container">
            <div className="upload-section">
                <h3>Upload Image</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="images-section">
                <div className="image-container">
                    <h3>Input Image</h3>
                    {uploadedImage ? (
                        <img src={uploadedImage} alt="Input" className="image" />
                    ) : (
                        <div className="placeholder">No Image Uploaded</div>
                    )}
                </div>

                <div className="image-container">
                    <h3>Resultant Image</h3>
                    {filter ? (
                        <canvas ref={canvasRef} className="image"></canvas>
                    ) : (
                        <div className="placeholder">Choose a filter to apply</div>
                    )}
                </div>
            </div>

            <div className="filter-section">
                {filter === "" ? (
                    <select onChange={(e) => setFilter(e.target.value)}>
                        <option value="">Select Filter</option>
                        <option value="gamma">Gamma Correction</option>
                        <option value="laplacian">Laplacian Filter</option>
                        <option value="gaussian">Gaussian Blur</option>
                        <option value="histogram-equalization">Histogram Equalization</option>
                        <option value="edge-detection">Edge Detection (Canny)</option>
                    </select>
                ) : (
                    <button onClick={() => setFilter("")}>Reset Filter</button>
                )}
                {filter && <button onClick={applyFilter}>Apply Filter</button>}
            </div>

            {filter && (
                <div className="description-container">
                    <h3>Filter Description</h3>
                    <p className="description">{filterDescription}</p>
                </div>
            )}
        </div>
    );
};

export default ImageEnhancement;
