// timerUtils.js
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const useTimer = (initialTime, isSubmitted, handleSubmitAssessment) => {
  const startTimer = (setTimeRemaining) => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1 && !isSubmitted) {
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  };

  return { startTimer };
};