import React, { useState, useEffect, useRef } from "react";
import Searchbar from "./searchbar/Searchbar";
import ImageGallery from "./imageGallery/ImageGallery";
import ImageGalleryItem from "./imageGalleryItem/ImageGalleryItem";
import Loader from "./loader/Loader";
import Button from "./button/Button";
import Modal from "./modal/Modal";


const App = () => { 
  const [value, setValue] = useState(null);
  const [page, setPage] = useState(0);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState([]);

  const firstRender = useRef(true);
  
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setResponse([]);
    console.log(response)

    fetchFunc();
  }, [value]);
  

  // ? Response Func


  const fetchFunc = async () => {
    const BASE_CASE = "https://pixabay.com/api/?";
    const API_KEY = "26654648-b583e9a090522ce0710c170d0";

    setStatus("pending");

    try {
      const requestImg = await fetch(`${BASE_CASE}key=${API_KEY}&q=${value}&page=${page}
      &image_type=photo&orientation=horizontal&per_page=12`);

      if (!requestImg.ok) {
        throw new Error("Error!!!")
      }

      const responseImg = await requestImg.json();
      createArr(responseImg);
    }
    catch (error) {
      console.log(error)
      setStatus("rejected");
    }
    finally {
      setPage(page + 1)
    }
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
    
  //  this.setState(prevState => {
  //    if (prevState.value !== text) {
  //      return {
  //        page: 1,
  //        value: text
  //      }
  //    }
  //    return { value: text }
  //  });
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
          <Button pressMore={fetchFunc}/>
        )}
      </div>
    )
};

export default App;
