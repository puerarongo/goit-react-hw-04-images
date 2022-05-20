import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as SearchIcon } from './search.svg';
import styles from './Searchbar.module.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const Searchbar = ({ submit }) => {
  const [text, setText] = useState('');

  const inputHandler = e => {
    setText(e.currentTarget.value.toLowerCase());
  };

  const submitHandler = e => {
    e.preventDefault();
    if (text.trim() === '') {
      return Notify.warning('Please, enter the word into the search engine');
    }

    submit(text);
    setText('');
  };

  return (
    <header className={styles.header}>
      <form className={styles.form} onSubmit={submitHandler}>
        <button type="submit" className={styles.button}>
          <SearchIcon width="20" height="15" fill="white" />
        </button>
        <input
          className={styles.form__input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={text}
          onChange={inputHandler}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default Searchbar;
