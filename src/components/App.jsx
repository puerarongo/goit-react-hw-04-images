import React, { useState, useEffect } from "react";
import Searchbar from "./searchbar/Searchbar";
import ImageGallery from "./imageGallery/ImageGallery";
import ImageGalleryItem from "./imageGalleryItem/ImageGalleryItem";
import Loader from "./loader/Loader";
import Button from "./button/Button";
import Modal from "./modal/Modal";

import fetchFunc from "funcFiles/fetchFunc";


const App = () => { 
  const [value, setValue] = useState(null);
  const [page, setPage] = useState(0);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState([]);
  
  useEffect(() => {
    requestHandler()
  }, [value]);
  

  // ? Response Func
  const requestHandler = () => {
    setStatus("pending");

    fetchFunc(value, page).then(pictures => createArr(pictures)).catch(error => {
      console.log(error)
      setStatus("rejected")
    })
      .finally(() => setPage(page + 1))
  }  

  const createArr = (value) => {
    const newArr = value.hits.map(elem => {
      return { id: elem.id, small: elem.webformatURL, big: elem.largeImageURL }
    })

    setResponse([...response, ...newArr]);
    setStatus("resolved");
  };
  

  const searchImg = (text) => {
    if (value !== text) {
      setPage(1)
    }
    setValue(text);
  };


  // ? Modal Func
  const modalHandler = id => {
    const imgId = response.find(elem => elem.id === id)
    setModalValue(imgId);
    modalOpen()
  }

  const modalOpen = () => {
    setShowModal(true)
  };

  const modalClose = () => {
    setShowModal(false)
  };


  // ? func
  return (
      <div>
        {showModal && (
          <Modal value={modalValue} funcClose={modalClose}/>
        )}
        <Searchbar submit={searchImg} />
        
        <ImageGallery>
          <ImageGalleryItem response={response} modal={modalHandler} />
        </ImageGallery>

        {status === "pending" && (
          <Loader />
        )}

        {response.length > 0 && (
          <Button pressMore={requestHandler}/>
        )}
      </div>
    )
};

export default App;