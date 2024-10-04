import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import './Webcamcamera.css';
import Images from './Images';

function Webcamcamera() {
    const webcamRef = useRef();
    const canvasRef = useRef();
    const [CapturedFace, setCapturedFace] = useState(null);
    const [recapture, setRecapture] = useState(false);
    const [IsModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [qrimg, setQrimg] = useState('');
    const [showWebcam, setShowWebcam] = useState(false);
    const [faceborder, showfaceborder] = useState(false)

    useEffect(() => {
        showfaceborder(true);
    });

    const handleConsent = (consent) => {
        if (consent) {
            setShowWebcam(true);
        } else {
            setShowWebcam(false);
        }
    };

    const handleCaptureClick = () => {
        if (isLoading) return; // Prevent additional clicks while loading

        setIsLoading(true); // Show loader and disable button

        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedFace(imageSrc);

            // Convert data URL to blob
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const fullFrameImageFile = new File([blob], 'captured_full_image.png', { type: 'image/png' });
                    const files = {
                        "photos": fullFrameImageFile,
                    };
                    const data = {
                        "gallery": 'test'
                    }

                    const url = "http://192.168.1.25/faceSearch/searchPerson.php";
                    const formData = new FormData();
                    Object.keys(files).forEach(key => formData.append(key, files[key]));
                    Object.keys(data).forEach(key => formData.append(key, data[key]));

                    fetch(url, {
                        method: "POST",
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Response data", data);
                            if (data.length > 0) {
                                setIsModalVisible(true);
                                setQrimg(data);

                            } else if (data.length <= 0) {
                                setIsLoading(false);
                                setRecapture(true);
                            }
                        })
                        .catch(error => console.error('An error occurred:', error))
                        .finally(() => {
                            setIsLoading(false);
                        });
                });
        }
    };

    return (
        <>
        <div className="webcam-container">
            <div className="myapp">
                <div className="row">
                   <div className="col">
                    <img src="https://img.freepik.com/free-vector/abstract-logo-gradient-color-style_23-2147507866.jpg?size=626&ext=jpg&ga=GA1.1.1318947987.1710155342&semt=ais_hybrid" alt="" />
                   </div>
                   <div className="col text-center fs-3">Company Name</div>
                   <div className="col m-auto last">
                   <img src="https://img.freepik.com/free-vector/abstract-logo-gradient-color-style_23-2147507866.jpg?size=626&ext=jpg&ga=GA1.1.1318947987.1710155342&semt=ais_hybrid" alt="" />
                   </div>
                </div>
                
                <div className="abc">
                    
                {!IsModalVisible && (
                    <div className="appvide">
                        {!showWebcam ? (
                            <div className="face-border">
                                <span className='fs-5'>We would like your permission to take your photo for Registration. Do you consent to this?</span><br></br>
                                <div className='d-flex justify-content-around mt-3'>
                                <button onClick={() => handleConsent(true)} className="consentbtn">Ok</button>
                                <button onClick={() => handleConsent(false)} className="consentbtn">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isLoading ? (
                                    CapturedFace && <img src={CapturedFace} alt="Captured face" style={{ transform: 'scaleX(-1)' }} />
                                ) : (
                                    <>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/png"
                                            videoConstraints={{ facingMode: "user" }}
                                            style={{ transform: 'scaleX(-1)' }}
                                        />
                                    </>
                                )}
                                <div className="capturebtn mt-2 mx-auto">
                                    <button onClick={handleCaptureClick} className='capture-button' disabled={isLoading}>
                                        {isLoading ? (
                                            <div>
                                                <span></span>Capturing...
                                            </div>
                                        ) : 'Capture'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {IsModalVisible && (
                        <Images qrimg={qrimg} />
                )}

                {isLoading && (
                    <div className="loader"></div>
                )}

                {recapture && !isLoading && (
                    <div className='showrecapture'>
                        <h3>Your face was not captured properly, please recapture again</h3>
                        <button onClick={() => setRecapture(false)}>Recapture</button>
                    </div>
                )}
                
                </div>


            </div>
        </div>
        </>
    );
}

export default Webcamcamera;
