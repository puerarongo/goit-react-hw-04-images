import React, { useState, useEffect } from 'react';
import Searchbar from './searchbar/Searchbar';
import ImageGallery from './imageGallery/ImageGallery';
import Loader from './loader/Loader';
import Button from './button/Button';
import Modal from './modal/Modal';

import fetchFunc from 'services/fetchFunc';
import { Report } from 'notiflix/build/notiflix-report-aio';

const App = () => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(0);
  const [response, setResponse] = useState([]);
  const [status, setStatus] = useState('idle');

  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState([]);

  useEffect(() => {
    if (!value) {
      return;
    }

    if (page > 0) {
      setStatus('pending');

      fetchFunc(value, page)
        .then(pictures => {
          if (pictures.total === 0) {
            Report.failure('Error', 'This images does not exist', 'OK');
            return this.setState({ status: 'rejected' });
          }

          const newArr = pictures.hits.map(elem => {
            return {
              id: elem.id,
              small: elem.webformatURL,
              big: elem.largeImageURL,
            };
          });

          setResponse(prevRes => [...prevRes, ...newArr]);
          setStatus('resolved');

          if (pictures.hits.length < 12) {
            Report.warning(
              'Warning',
              "We're sorry, but you've reached the end of search results.",
              'OK'
            );
            this.setState({ status: 'rejected' });
          }
        })
        .catch(error => {
          console.log(error);
          setStatus('rejected');
        });
    }
  }, [value, page]);

  const searchImg = text => {
    if (value === text) {
      return;
    }
    setValue(text);
    setPage(1);
    setResponse([]);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  // ? Modal Func
  const modalHandler = id => {
    const imgId = response.find(elem => elem.id === id);
    setModalValue(imgId);
    modalOpen();
  };

  const modalOpen = () => {
    setShowModal(true);
  };

  const modalClose = () => {
    setShowModal(false);
  };

  // ? func
  return (
    <div>
      {showModal && <Modal value={modalValue} funcClose={modalClose} />}
      <Searchbar submit={searchImg} />

      <ImageGallery response={response} modal={modalHandler} />

      {status === 'pending' && <Loader />}

      {status === 'resolved' && <Button pressMore={loadMore} />}
    </div>
  );
};

export default App;
