import React, { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
function Form() {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [model, setModel] = useState(null)
    const [predictionSentence, setPredictionSentence] = useState("")

    // useRef is used to simulate a click on <input type="file" by clicking the button>
    const imgUploadref = useRef()

    // image reference for ML prediction
    const imageRef = useRef(null)


    // on uploading the image we save the on image use state
    const handleOnChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
        } else {
            setImage(null)
        }
    }

    // we the state of image changes, i.e image is uploaded
    // we preview the image using FileReader and save it preview use state
    // preview is done using "base64" string
    useEffect(() => {
        if (image) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(image) // return image base64 string
        } else {
            setPreview(null)
        }

    }, [image])

    const handleOnClick = (e) => {
        e.preventDefault()
        imgUploadref.current.click();
    }

    
    // load the ML model on first load-up
    useEffect(() => {
        async function fetchModel() {
            try {
                const model = await tf.loadLayersModel("http://localhost:5000/models/classify")
                // console.log("successfull");
                // console.log(model);
                setModel(model)
            } catch (error) {
                console.log(error);
            }
        }
        fetchModel()
    }, [])

    // classify the image
    const handleClassifyClick = async (e) => {
        e.preventDefault()

        async function makePrediction() {
            if (imageRef && model) {
                const imgTensor = tf.browser.fromPixels(imageRef.current) //to array
                    .resizeNearestNeighbor([28, 28]) // resize
                    .mean(2)
                    .toFloat() // convting to float
                    .div(tf.scalar(255.0)) // normalization
                    .expandDims()
                    .reshape([1,28*28]) // flatten
                
                console.log(imgTensor);
                const predictions = await model.predict(imgTensor).data()
                console.log(predictions);
                let maxEle = -1
                let maxPos = -1
                for (let i = 0; i < predictions.length; i++) {
                    const element = predictions[i];
                    if(element>maxEle){
                        maxEle = element
                        maxPos = i;
                    }
                }
                console.log(maxPos);
                setPredictionSentence(`Predicted Value: ${maxPos}`)
                // const res = tf.tensor1d(predictions)
                // console.log(res);
            } else {
                console.log("No image");
            }
        }

        makePrediction()
    }

    const handleClearClick = () =>{
        setPreview("")
        setPredictionSentence("")
    }

    return (
        <div className='form'>
            <form>
                <label>Upload Image:</label><br />

                {/* file input type(it is hidden) */}
                <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    // value={image}
                    onChange={handleOnChange}
                    ref={imgUploadref}
                    style={{ display: "none" }}
                />
                <br />


                {/* if preview is not null we view the image else the object */}
                {preview ? (
                    <img
                        className='digit_image'
                        src={preview} alt="digit"
                        style={{ objectFit: "cover" }}
                        ref={imageRef}
                    />
                ) : (
                    <button
                        className='form_button'
                        onClick={handleOnClick}>
                        Add Digit Image
                    </button>
                )}
            </form>
            <div>
                <form>
                    <button className='classify_button' onClick={handleClassifyClick}>Classify</button>
                    <button className='clear_button' onClick={handleClearClick}>Clear</button>
                    <p>{predictionSentence}</p>
                </form>
            </div>
        </div>
    )
}

export default Form