import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// ? import PORTAL
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const modalRoot = document.querySelector('#modal__root');

const Modal = ({ value, funcClose }) => {
  const { id, big } = value;

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  // ? func
  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      funcClose();
    }
  };

  const handlerClick = e => {
    if (e.currentTarget === e.target) {
      funcClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handlerClick}>
      <div className={styles.modal}>
        <img className={styles.img} src={big} alt={id} />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  value: PropTypes.shape({
    big: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    small: PropTypes.string.isRequired,
  }),
  funcClose: PropTypes.func.isRequired,
};

export default Modal;
