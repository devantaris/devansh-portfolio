import { useState, useEffect } from 'react';

export function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing phase
                if (currentText.length < currentWord.length) {
                    setCurrentText(currentWord.slice(0, currentText.length + 1));
                } else {
                    // Word complete, pause then start deleting
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            } else {
                // Deleting phase
                if (currentText.length > 0) {
                    setCurrentText(currentText.slice(0, -1));
                } else {
                    // Done deleting, move to next word
                    setIsDeleting(false);
                    setCurrentWordIndex((currentWordIndex + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, currentWordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration]);

    return currentText;
}
