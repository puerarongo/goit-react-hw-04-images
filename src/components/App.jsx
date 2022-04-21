import React, { useState, useEffect } from "react";
import Searchbar from "./searchbar/Searchbar";
import ImageGallery from "./imageGallery/ImageGallery";
import ImageGalleryItem from "./imageGalleryItem/ImageGalleryItem";
import Loader from "./loader/Loader";
import Button from "./button/Button";
import Modal from "./modal/Modal";

import fetchFunc from "funcFiles/fetchFunc";


const App = () => { 
  const [value, setValue] = useState("");
  //const [preV, setPreV] = useState(undefined) // ? for check
  const [page, setPage] = useState(0);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState("idle");
  
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState([]);


  useEffect(() => {
    if (!value) {
      return
    }

    if (page > 0) {
      fetchFunc(value, page).then(pictures => {
        const newArr = pictures.hits.map(elem => {
          return { id: elem.id, small: elem.webformatURL, big: elem.largeImageURL }
        })
        setResponse(prevRes => [...prevRes, ...newArr]);
        setStatus("resolved");
      }).catch(error => {
      console.log(error)
      setStatus("rejected")
      })
      //.finally(() => setPreV(value))
    }
  }, [value, page]);


  const searchImg = (text) => {
    if (value === text) {
      return
    }
    setValue(text)
    setPage(1)
    setResponse([])
  };

  const loadMore = () => {
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