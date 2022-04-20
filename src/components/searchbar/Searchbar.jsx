import React, { useState } from "react";
import styles from "./Searchbar.module.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const Searchbar = ({submit}) => {
    const [text, setText] = useState("");

    const inputHandler = e => {
        setText(e.currentTarget.value.toLowerCase())
    };


    const submitHandler = (e) => {
        e.preventDefault();
        if (text.trim() === "") {
            return Notify.warning("Please, enter the word into the search engine");
        }

        submit(text);
        setText("");
    };


    return (
        <header className={styles.header}>
            <form className={styles.form} onSubmit={submitHandler}>
                <button type="submit" className={styles.button}>
                    <span className="button-label">Search</span>
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

export default Searchbar;