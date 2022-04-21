import React, { useState, useEffect } from "react";
import Searchbar from "./searchbar/Searchbar";
import ImageGallery from "./imageGallery/ImageGallery";
import ImageGalleryItem from "./imageGalleryItem/ImageGalleryItem";
import Loader from "./loader/Loader";
import Button from "./button/Button";
import Modal from "./modal/Modal";

import fetchFunc from "funcFiles/fetchFunc";


const App = () => { 
  const [value, setValue] = useState(undefined);
  const [page, setPage] = useState(0);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState("idle");
  
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState([]);

  useEffect(() => {
    fetchFunc(value, page).then(pictures => {
        const newArr = pictures.hits.map(elem => {
          return { id: elem.id, small: elem.webformatURL, big: elem.largeImageURL }
        })
        setResponse([...response, ...newArr]);
        setStatus("resolved");
      }).catch(error => {
      console.log(error)
      setStatus("rejected")
    })
  }, [value, page, response]);


  const searchImg = (text) => {
    console.log(text)
    if (value !== text) {
      setPage(1)
      setValue(text)
      setResponse([])
    }
  };

  const loadMore = () => {
    console.log(page)
    setPage(page + 1)
  };

  // ? Modal Func
  const modalHandler = id => {
    const imgId = response.find(elem => elem.id === id)
    setModalValue(imgId);
    modalOpen()
  };

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
          <Button pressMore={loadMore}/>
        )}
      </div>
    )
};

export default App;