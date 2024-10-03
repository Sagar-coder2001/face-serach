import React, { useState } from 'react';
import './Images.css';

const Images = ({ qrimg }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 10;

    // Calculate the images for the current page
    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = qrimg.slice(indexOfFirstImage, indexOfLastImage);

    // Handle page change
    const handleNextPage = () => {
        if (currentPage < Math.ceil(qrimg.length / imagesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="image-container">
                {
                    currentImages.map((element, index) => (
                        <div className="card-container" key={index}>
                            <img src={element.url} alt="QR Code" />
                            <button className='btn btn-sm btn-success mt-2'>Download</button>
                        </div>
                    ))
                }
            </div>

            <div className="pagination">
                <button
                    className='btn btn-primary'
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button
                    className='btn btn-primary'
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(qrimg.length / imagesPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Images;
